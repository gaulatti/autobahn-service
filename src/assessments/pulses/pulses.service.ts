import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Heartbeat } from 'src/models/heartbeat.model';
import { Membership } from 'src/models/membership.model';
import { Project } from 'src/models/project.model';
import { Pulse } from 'src/models/pulse.model';
import { Schedule } from 'src/models/schedule.model';
import { Target } from 'src/models/target.model';
import { Url } from 'src/models/url.model';
import { User } from 'src/models/user.model';
import { getPaginationParams } from 'src/utils/lists';

@Injectable()
export class PulsesService {
  constructor(
    @InjectModel(Pulse)
    private readonly pulse: typeof Pulse,
  ) {}

  pulsesByTarget(uuid: string) {
    throw new Error('Method not implemented.');
  }

  /**
   * Retrieves pulses by URL ID within a specified date range and pagination parameters.
   *
   * @param id - The URL ID to filter pulses.
   * @param from - The start date of the date range (optional).
   * @param to - The end date of the date range (optional).
   * @param startRow - The starting row for pagination (optional).
   * @param endRow - The ending row for pagination (optional).
   * @returns A promise that resolves to the list of pulses matching the criteria.
   */
  pulsesByUrl(
    id: number,
    from?: Date,
    to?: Date,
    startRow?: number,
    endRow?: number,
  ) {
    const paginationParams = getPaginationParams(startRow, endRow);

    return this.pulse.findAll({
      ...paginationParams,
      where: {
        urlId: id,
        createdAt: {
          [Op.between]: [from, to],
        },
      },
      include: [{ model: Heartbeat, as: 'heartbeats' }],
    });
  }

  /**
   * Retrieves all pulses along with their associated Heartbeat, Url, Target,
   * and Membership models. The Membership model includes associated User models.
   * The results are distinct and include a count of the total number of pulses.
   *
   * @returns {Promise<{ rows: Pulse[], count: number }>} A promise that resolves
   * to an object containing an array of pulses and the total count.
   */
  async allPulses(): Promise<{ rows: Pulse[]; count: number }> {
    return this.pulse.findAndCountAll({
      include: [
        { model: Heartbeat },
        { model: Url },
        { model: Target },
        {
          model: Membership,
          include: [
            {
              model: User,
            },
          ],
        },
      ],
      distinct: true,
    });
  }

  getPulse(uuid: string): Promise<Pulse> {
    return this.pulse.findOne({
      where: { uuid },
      include: [
        { model: Heartbeat },
        { model: Url },
        { model: Target },
        { model: Schedule, include: [{ model: Project }] },
        {
          model: Membership,
          include: [
            {
              model: User,
            },
          ],
        },
      ],
    });
  }
}
