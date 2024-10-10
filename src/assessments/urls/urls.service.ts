import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Url } from 'src/models/url.model';
import { PulsesService } from '../pulses/pulses.service';
import { calculateCWVStats, calculateScores } from 'src/utils/stats';
import { getPaginationParams } from 'src/utils/lists';
import { Pulse } from 'src/models/pulse.model';

@Injectable()
export class UrlsService {
  constructor(
    @InjectModel(Url) private readonly url: typeof Url,
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
   * Retrieves a URL record from the database using the provided UUID.
   *
   * @param uuid - The unique identifier for the URL record.
   * @returns A promise that resolves to the URL record if found, or null if not found.
   */
  async urlByUUID(uuid: string) {
    return this.url.findOne({ where: { uuid } });
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
    return await this.url.create({ url });
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
          model: Pulse,
          as: 'pulses',
          where: { targets_id: id },
          required: true,
        },
      ],
      distinct: true,
    });
  }

  /**
   * Retrieves statistics for a given URL within a specified date range.
   *
   * @param uuid - The unique identifier of the URL.
   * @param from - The start date for the statistics.
   * @param to - The end date for the statistics.
   * @returns An object containing the URL record, CWV (Core Web Vitals) stats, and calculated scores.
   *
   * @remarks
   * - Fetches the URL record by UUID.
   * - Retrieves pulses for the provided URL within the date range.
   * - Filters out pulses that don't have any completed heartbeats.
   * - Calculates scores and CWV stats for the filtered pulses.
   */
  async urlStats(id: number, from: Date, to: Date) {
    /**
     * Fetch the pulses for the provided URL
     */
    const pulses = await this.pulsesService.pulsesByUrl(id, from, to);

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
