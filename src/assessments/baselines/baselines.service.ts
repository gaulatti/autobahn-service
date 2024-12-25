import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Baseline } from 'src/models/baseline.model';
import { TargetsService } from '../targets/targets.service';
import { BaselinesDto } from './baselines.dto';

@Injectable()
export class BaselinesService {
  constructor(
    @InjectModel(Baseline) private readonly baseline: typeof Baseline,
    private readonly targetsService: TargetsService,
  ) {}

  /**
   * Updates the baseline for a given target identified by its slug.
   *
   * @param slug - The unique identifier of the target.
   * @param dto - The data transfer object containing the baseline details.
   * @returns The updated baseline.
   *
   * @remarks
   * The function determines the mode based on whether the target is mobile or not.
   * It retrieves the target and its baselines, then finds the current baseline for the mode.
   * If no baseline exists for the mode, a new one is created.
   * The baseline is then updated with the new value and saved.
   */
  async updateBaseline(slug: string, dto: BaselinesDto) {
    const mode = dto.isMobile ? 0 : 1;
    const { id, baselines } = await this.targetsService.getTarget(slug);
    const currentBaseline =
      baselines.find((baseline) => baseline.mode === mode) ||
      new Baseline({ mode, targetId: id });

    /**
     * Update the baseline with the new value
     */
    const statKey = dto.stat.toLowerCase();

    /**
     * Update the baseline with the new value
     */

    currentBaseline[statKey] = dto.value;

    /**
     * Save the updated baseline
     */
    await currentBaseline.save();

    return currentBaseline;
  }
}
