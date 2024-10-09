import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Url } from 'src/models/url.model';
import { PulsesService } from '../pulses/pulses.service';
import { calculateCWVStats, calculateScores } from 'src/utils/stats';
import { getPaginationParams } from 'src/utils/lists';

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

  async urlsByTarget(uuid: string) {
    throw new Error(`Method not implemented (URLs for uuid ${uuid})`);
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
  async urlStats(uuid: string, from: Date, to: Date) {
    /**
     * Fetch the URL record by UUID
     */
    const url = await this.urlByUUID(uuid);

    /**
     * Fetch the pulses for the provided URL
     */
    const pulses = await this.pulsesService.pulsesByUrl(url.id, from, to);

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

    return { url, cwvStats, scores };
  }
}
