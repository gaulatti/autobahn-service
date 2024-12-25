import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Baseline } from 'src/models/baseline.model';
import { Target } from 'src/models/target.model';
import { getPaginationParams, getSortParams } from 'src/utils/lists';
import { calculateCWVStats, calculateScores } from 'src/utils/stats';
import { PulsesService } from '../pulses/pulses.service';
import { UrlsService } from '../urls/urls.service';
import { TargetsDto } from './targets.dto';

@Injectable()
export class TargetsService {
  constructor(
    @InjectModel(Target) private readonly target: typeof Target,
    private readonly pulsesService: PulsesService,
    private readonly urlsService: UrlsService,
  ) {}

  /**
   * Retrieves all targets with optional pagination.
   *
   * @param startRow - The starting row for pagination (optional).
   * @param endRow - The ending row for pagination (optional).
   * @returns A promise that resolves to an object containing the targets and the total count.
   */
  allTargets(sort: string, startRow?: number, endRow?: number) {
    const paginationParams = getPaginationParams(startRow, endRow);

    return this.target.findAndCountAll({
      ...paginationParams,
      order: getSortParams(sort),
    });
  }

  /**
   * Deletes a target by its slug.
   *
   * @param slug - The unique identifier of the target to be deleted.
   * @returns A promise that resolves when the target has been deleted.
   *
   * @remarks
   * This method currently performs a hard delete.
   * TODO: Implement soft delete functionality.
   */
  async deleteTarget(slug: string) {
    /**
     * TODO: Implement Soft Delete
     */
    const item = await this.getTarget(slug);
    await item.destroy();
  }

  /**
   * Updates a target identified by the given slug with the provided data transfer object (DTO).
   *
   * @param slug - The unique identifier of the target to be updated.
   * @param dto - The data transfer object containing the updated target information.
   * @returns A promise that resolves to the updated target.
   */
  async updateTarget(slug: string, dto: TargetsDto) {
    const { stage, name } = dto;

    /**
     * Fetch the URL record by the fully qualified domain name (FQDN)
     */
    const url = await this.urlsService.urlByFQDN(dto.target);

    await this.target.update(
      { stage, name, urlId: url.id },
      { where: { slug } },
    );

    return this.getTarget(slug);
  }

  /**
   * Creates a new target using the provided data transfer object (DTO).
   *
   * @param dto - The data transfer object containing the target details.
   * @returns The created target object.
   */
  async createTarget(dto: TargetsDto) {
    const { stage, name } = dto;

    /**
     * Fetch the URL record by the fully qualified domain name (FQDN)
     */
    const url = await this.urlsService.urlByFQDN(dto.target);

    /**
     * Create the target record
     */
    return this.target.create({ stage, name, urlId: url.id, provider: 1 });
  }

  /**
   * Retrieves a target by its slug.
   *
   * @param slug - The unique identifier of the target.
   * @returns A promise that resolves to the target object if found, or null if not found.
   */
  async getTarget(slug: string) {
    return this.target.findOne({
      where: { slug },
      include: [{ model: Baseline }],
    });
  }

  async targetStats(id: number, sort: string, from?: Date, to?: Date) {
    /**
     * Fetch the pulses for the provided URL
     */
    const pulses = await this.pulsesService.pulsesByTarget(id, sort, from, to);

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

  async targetBySlug(slug: string) {
    return this.target.findOne({
      where: { slug },
      include: [Baseline],
    });
  }

  async targetsByUrl(slug: string) {
    throw new Error(`Method not implemented. Targets by URL ${slug}`);
  }
}
