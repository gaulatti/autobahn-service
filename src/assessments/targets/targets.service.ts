import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Target } from 'src/models/target.model';
import { getPaginationParams } from 'src/utils/lists';
import { calculateCWVStats, calculateScores } from 'src/utils/stats';
import { PulsesService } from '../pulses/pulses.service';
import { TargetsDto } from './targets.dto';

@Injectable()
export class TargetsService {
  constructor(
    @InjectModel(Target) private readonly target: typeof Target,
    private readonly pulsesService: PulsesService,
  ) {}

  /**
   * Retrieves all targets with optional pagination.
   *
   * @param startRow - The starting row for pagination (optional).
   * @param endRow - The ending row for pagination (optional).
   * @returns A promise that resolves to an object containing the targets and the total count.
   */
  allTargets(startRow?: number, endRow?: number) {
    const paginationParams = getPaginationParams(startRow, endRow);

    return this.target.findAndCountAll({
      ...paginationParams,
    });
  }

  /**
   * Deletes a target by its UUID.
   *
   * @param uuid - The unique identifier of the target to be deleted.
   * @returns A promise that resolves when the target has been deleted.
   *
   * @remarks
   * This method currently performs a hard delete.
   * TODO: Implement soft delete functionality.
   */
  async deleteTarget(uuid: string) {
    /**
     * TODO: Implement Soft Delete
     */
    const item = await this.getTarget(uuid);
    await item.destroy();
  }

  /**
   * Updates a target identified by the given UUID with the provided data transfer object (DTO).
   *
   * @param uuid - The unique identifier of the target to be updated.
   * @param dto - The data transfer object containing the updated target information.
   * @returns A promise that resolves to the updated target.
   */
  async updateTarget(uuid: string, dto: TargetsDto) {
    await this.target.update(dto, {
      where: { uuid },
    });

    return this.getTarget(uuid);
  }

  /**
   * Creates a new target using the provided data transfer object (DTO).
   *
   * @param dto - The data transfer object containing the target details.
   * @returns The created target object.
   */
  createTarget(dto: TargetsDto) {
    return this.target.create({ ...dto, provider: 1 });
  }

  /**
   * Retrieves a target by its UUID.
   *
   * @param uuid - The unique identifier of the target.
   * @returns A promise that resolves to the target object if found, or null if not found.
   */
  async getTarget(uuid: string) {
    return this.target.findOne({
      where: { uuid },
    });
  }

  async targetStats(id: number, from?: Date, to?: Date) {
    /**
     * Fetch the pulses for the provided URL
     */
    const pulses = await this.pulsesService.pulsesByTarget(id, from, to);

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

  async targetByUUID(uuid: string) {
    return this.target.findOne({ where: { uuid } });
  }

  targetsByUrl(uuid: string) {
    throw new Error('Method not implemented.');
  }
}
