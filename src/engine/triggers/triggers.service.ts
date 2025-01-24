import { Injectable } from '@nestjs/common';
import { Op, Sequelize } from 'sequelize';
import { Logger } from 'src/decorators/logger.decorator';
import { Plugin } from 'src/models/plugin.model';
import { Slot } from 'src/models/slot.model';
import { Strategy } from 'src/models/strategy.model';
import { Target } from 'src/models/target.model';
import { ScheduleContext, Trigger } from 'src/models/trigger.model';
import { getNextExecution } from 'src/utils/cron';
import { JSONLogger } from 'src/utils/logger';

@Injectable()
export class TriggersService {
  /**
   * Logger instance for logging messages.
   */
  @Logger(TriggersService.name)
  private readonly logger!: JSONLogger;

  /**
   * Retrieves all triggers of type 'SCHEDULE' from the database.
   *
   * @returns {Promise<Trigger[]>} A promise that resolves to an array of scheduled triggers.
   * @throws Will throw an error if there is an issue fetching the scheduled triggers.
   */
  async getScheduledTriggers(): Promise<Trigger[]> {
    try {
      const scheduledTriggers = await Trigger.findAll({
        where: {
          type: 'SCHEDULE',
        },
      });
      return scheduledTriggers;
    } catch (error) {
      this.logger.error('Error fetching scheduled triggers:', error);
      throw error;
    }
  }

  /**
   * Finds and returns all scheduled triggers that are due on or before the current time.
   *
   * This method queries the database for triggers of type 'SCHEDULE' where the next execution time
   * (stored in the JSON context) is less than or equal to the current time. It includes related
   * models such as Strategy, Slot, and Plugin in the result.
   *
   * @returns {Promise<Trigger[]>} A promise that resolves to an array of due Trigger objects.
   *
   * @throws Will throw an error if there is an issue fetching the scheduled triggers.
   */
  async findDueSchedules(): Promise<Trigger[]> {
    const now = new Date();
    const formattedNow = now.toISOString();

    try {
      const triggers = await Trigger.findAll({
        where: {
          type: 'SCHEDULE',
          [Op.and]: Sequelize.literal(
            `JSON_UNQUOTE(JSON_EXTRACT(context, '$.next_execution')) <= '${formattedNow}'`,
          ),
        },
        include: [
          {
            model: Strategy,
            include: [{ model: Slot, include: [Plugin] }, Target],
          },
        ],
      });

      return triggers;
    } catch (error) {
      this.logger.error(
        'Error fetching scheduled triggers on or before the current time:',
        error,
      );
      throw error;
    }
  }

  /**
   * Updates the next execution schedule for a given trigger.
   *
   * @param {Trigger} trigger - The trigger object containing the schedule context.
   * @returns {Promise<void>} A promise that resolves when the next execution date is updated.
   *
   * @remarks
   * This method performs the following steps:
   * 1. Extracts the context from the trigger.
   * 2. Calculates the next execution date based on the current execution date and cron expression.
   * 3. Updates the context with the new next execution date and saves the changes.
   */
  async updateNextSchedule(trigger: Trigger): Promise<void> {
    /**
     * 1. Extract the context from the trigger
     */
    const context = trigger.context as ScheduleContext;

    /**
     * 2. Calculate the next execution date
     */
    const currentExecutionDate = new Date(context.next_execution);
    const nextExecutionDate = getNextExecution(
      context.cron,
      currentExecutionDate,
    );

    /**
     * 3. Update the context with the next execution date
     */
    await trigger.update({
      context: {
        ...context,
        next_execution: nextExecutionDate.toISOString(),
      },
    });
  }
}
