import { Module } from '@nestjs/common';
import { PulsesController } from './pulses/pulses.controller';
import { PulsesService } from './pulses/pulses.service';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';
import { UrlsService } from './urls/urls.service';
import { UrlsController } from './urls/urls.controller';
import { TargetsService } from './targets/targets.service';
import { TargetsController } from './targets/targets.controller';
import { DalModule } from 'src/dal/dal.module';
import { HeartbeatsController } from './heartbeats/heartbeats.controller';
import { HeartbeatsService } from './heartbeats/heartbeats.service';
import { SchedulesService } from './schedules/schedules.service';
import { SchedulesController } from './schedules/schedules.controller';
import { BaselinesController } from './baselines/baselines.controller';
import { BaselinesService } from './baselines/baselines.service';

@Module({
  imports: [DalModule],
  controllers: [
    PulsesController,
    ProjectsController,
    UrlsController,
    TargetsController,
    HeartbeatsController,
    SchedulesController,
    BaselinesController,
  ],
  providers: [
    PulsesService,
    ProjectsService,
    UrlsService,
    TargetsService,
    HeartbeatsService,
    SchedulesService,
    BaselinesService,
  ],
})
export class AssessmentsModule {}
