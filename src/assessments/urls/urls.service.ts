import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from 'src/logger/logger.decorator';
import { Target } from 'src/models/target.model';
import { Url } from 'src/models/url.model';
import { getPaginationParams } from 'src/utils/lists';
import { JSONLogger } from 'src/utils/logger';
import { calculateCWVStats, calculateScores } from 'src/utils/stats';
import { nanoid } from '../../utils/nanoid';
import { PulsesService } from '../pulses/pulses.service';

/**
 * Service for managing URLs and related operations.
 */
@Injectable()
export class UrlsService {
  /**
   * Logger instance for logging messages.
   */
  @Logger(UrlsService.name)
  private readonly logger!: JSONLogger;

  /**
   * Constructs a new instance of the UrlsService.
   *
   * @param url - The URL model injected by the dependency injection framework.
   * @param pulsesService - The PulsesService injected by the dependency injection framework.
   */
  constructor(
    @InjectModel(Url) private readonly url: typeof Url,
    @Inject(forwardRef(() => PulsesService))
    private readonly pulsesService: PulsesService,
  ) {}

  /**
   * Retrieves all URLs with optional pagination.
   *
   * @param startRow - The starting row for pagination (optional).
   * @param endRow - The ending row for pagination (optional).
   * @returns A promise that resolves to an array of URLs and the total count.
   */
  async allUrls(startRow?: number, endRow?: number) {
    const paginationParams = getPaginationParams(startRow, endRow);
    return this.url.findAndCountAll({ ...paginationParams });
  }

  /**
   * Retrieves a URL record from the database using the provided Slug.
   *
   * @param slug - The unique identifier for the URL record.
   * @returns A promise that resolves to the URL record if found, or null if not found.
   */
  async urlBySlug(slug: string) {
    return this.url.findOne({ where: { slug } });
  }

  /**
   * Retrieves or creates a URL entry based on the fully qualified domain name (FQDN).
   *
   * @param url - The fully qualified domain name to search for or create.
   * @returns The existing URL entry if found, otherwise a new URL entry is created and returned.
   */
  async urlByFQDN(url: string) {
    const item = await this.url.findOne({ where: { url } });

    if (!item) {
      return await this.createUrl(url);
    }

    return item;
  }

  /**
   * Creates a new URL entry in the database.
   *
   * @param url - The URL string to be created.
   * @returns A promise that resolves to the created URL object.
   */
  async createUrl(url: string) {
    return await this.url.create({ url, slug: nanoid() });
  }

  /**
   * Retrieves URLs associated with a specific target ID.
   *
   * @param id - The ID of the target to filter URLs by.
   * @returns A promise that resolves to an object containing the count of URLs and an array of URL instances.
   */
  async urlsByTarget(id: number) {
    return this.url.findAndCountAll({
      include: [
        {
          model: Target,
          where: { id },
          required: true,
        },
      ],
      distinct: true,
    });
  }

  /**
   * Attaches a given URL to a target by its ID.
   *
   * @param {Url} url - The URL instance to be attached to the target.
   * @param {number} targetId - The ID of the target to which the URL will be attached.
   * @throws {Error} Throws an error if the target with the specified ID is not found.
   * @returns {Promise<void>} A promise that resolves when the URL has been successfully attached to the target.
   */
  async attachToTarget(urlId: number, targetId: number): Promise<void> {
    const url = await Url.findByPk(urlId);
    const target = await Target.findByPk(targetId);

    if (!target) {
      throw new Error(`Target with ID ${targetId} not found`);
    }

    /**
     * Check if the relation already exists
     */
    const exists = await url.$has('targets', target);

    if (!exists) {
      await url.$add('targets', target);
    }
  }

  /**
   * Retrieves statistics for a given URL within a specified date range.
   *
   * @param slug - The unique identifier of the URL.
   * @param from - The start date for the statistics.
   * @param to - The end date for the statistics.
   * @returns An object containing the URL record, CWV (Core Web Vitals) stats, and calculated scores.
   *
   * @remarks
   * - Fetches the URL record by Slug.
   * - Retrieves pulses for the provided URL within the date range.
   * - Filters out pulses that don't have any completed heartbeats.
   * - Calculates scores and CWV stats for the filtered pulses.
   */
  async urlStats(id: number, sort: string, from: Date, to: Date) {
    /**
     * Fetch the pulses for the provided URL
     */
    const pulses = await this.pulsesService.pulsesByUrl(id, sort, from, to);

    /**
     * Filter out pulses that don't have any completed heartbeats
     */
    const statPulses = pulses.rows.filter(
      (pulse: { heartbeats: { status: number }[] }) =>
        pulse.heartbeats.every((heartbeat) => heartbeat.status === 4),
    );

    /**
     * Calculate the scores and CWV stats for the provided pulses
     */
    const scores = calculateScores(statPulses);
    const cwvStats = calculateCWVStats(statPulses);

    return { cwvStats, scores };
  }
}
