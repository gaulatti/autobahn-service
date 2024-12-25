import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Schedule } from 'src/models/schedule.model';
import { ProjectsService } from '../projects/projects.service';
import { SchedulesDto } from './schedules.dto';

/**
 * Service to manage schedules.
 * DEPRECATED
 */
@Injectable()
export class SchedulesService {
  /**
   * Retrieves schedules by target Slug.
   * @param slug - The Slug of the target.
   * @throws Error if the method is not implemented.
   */
  async schedulesByTarget(slug: string) {
    throw new Error(`Method not implemented. (schedulesByTarget for ${slug})`);
  }

  /**
   * Constructs a new instance of SchedulesService.
   * @param schedule - The schedule model to be injected.
   * @param projectsService - The projects service to be injected.
   */
  constructor(
    @InjectModel(Schedule)
    private readonly schedule: typeof Schedule,
    private readonly projectsService: ProjectsService,
  ) {}

  /**
   * Retrieves all schedules for a given project Slug.
   * @param slug - The Slug of the project.
   * @returns A promise that resolves to an array of schedules.
   */
  async allSchedules(slug: string): Promise<Schedule[]> {
    const project = await this.projectsService.getProject(slug);

    return project.schedules;
  }

  /**
   * Retrieves a schedule by its Slug.
   * @param slug - The Slug of the schedule.
   * @returns A promise that resolves to the schedule.
   */
  async getSchedule(slug: string): Promise<Schedule> {
    return this.schedule.findOne({
      where: { slug },
    });
  }

  /**
   * Creates a new schedule for a given project Slug.
   * @param slug - The Slug of the project.
   * @param schedule - The schedule data transfer object.
   * @returns A promise that resolves to the created schedule.
   */
  async createSchedule(
    slug: string,
    schedule: SchedulesDto,
  ): Promise<Schedule> {
    const project = await this.projectsService.getProject(slug);

    return project.$create('schedule', {
      ...schedule,
      provider: 1,
      nextExecution: new Date(),
    });
  }

  /**
   * Updates an existing schedule by its Slug.
   * @param slug - The Slug of the schedule.
   * @param schedule - The schedule data transfer object.
   * @returns A promise that resolves to the updated schedule.
   */
  async updateSchedule(
    slug: string,
    schedule: SchedulesDto,
  ): Promise<Schedule> {
    await this.schedule.update(schedule, {
      where: { slug },
    });

    return this.getSchedule(slug);
  }

  /**
   * Soft deletes a schedule by its Slug.
   * @param slug - The Slug of the schedule.
   * @returns A promise that resolves when the schedule is deleted.
   */
  async deleteSchedule(slug: string): Promise<void> {
    await this.schedule.update(
      { deletedAt: new Date() },
      {
        where: { slug },
      },
    );
  }
}
