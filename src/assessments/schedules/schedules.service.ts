import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Schedule } from 'src/models/schedule.model';
import { ProjectsService } from '../projects/projects.service';
import { SchedulesDto } from './schedules.dto';

@Injectable()
export class SchedulesService {
  async schedulesByTarget(uuid: string) {
    throw new Error(`Method not implemented. (schedulesByTarget for ${uuid})`);
  }
  constructor(
    @InjectModel(Schedule)
    private readonly schedule: typeof Schedule,
    private readonly projectsService: ProjectsService,
  ) {}

  async allSchedules(uuid: string): Promise<Schedule[]> {
    const project = await this.projectsService.getProject(uuid);

    return project.schedules;
  }

  async getSchedule(uuid: string): Promise<Schedule> {
    return this.schedule.findOne({
      where: { uuid },
    });
  }

  async createSchedule(
    uuid: string,
    schedule: SchedulesDto,
  ): Promise<Schedule> {
    const project = await this.projectsService.getProject(uuid);

    return project.$create('schedule', {
      ...schedule,
      provider: 1,
      nextExecution: new Date(),
    });
  }

  async updateSchedule(
    uuid: string,
    schedule: SchedulesDto,
  ): Promise<Schedule> {
    await this.schedule.update(schedule, {
      where: { uuid },
    });

    return this.getSchedule(uuid);
  }

  async deleteSchedule(uuid: string): Promise<void> {
    await this.schedule.update(
      { deletedAt: new Date() },
      {
        where: { uuid },
      },
    );
  }
}
