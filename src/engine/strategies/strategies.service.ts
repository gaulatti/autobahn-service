import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Plugin } from 'src/models/plugin.model';
import { Slot } from 'src/models/slot.model';
import { Strategy } from 'src/models/strategy.model';

@Injectable()
/**
 * Service for handling operations related to strategies.
 */
export class StrategiesService {
  /**
   * Constructs an instance of the StrategiesService.
   *
   * @param strategy - The injected Strategy model used for database operations.
   */
  constructor(
    @InjectModel(Strategy) private readonly strategy: typeof Strategy,
  ) {}

  /**
   * Finds a strategy by its ID.
   *
   * @param id - The ID of the strategy to find.
   * @returns A promise that resolves to the found strategy, including its associated slots.
   */
  async findById(id: number) {
    return this.strategy.findOne({
      where: { id },
      include: [{ model: Slot, include: [Plugin] }],
    });
  }
}
