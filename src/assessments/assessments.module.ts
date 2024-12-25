import { Module } from '@nestjs/common';
import { AuthorizationModule } from 'src/authorization/authorization.module';
import { CoreModule } from 'src/core/core.module';
import { DalModule } from 'src/dal/dal.module';
import { BaselinesController } from './baselines/baselines.controller';
import { BaselinesService } from './baselines/baselines.service';
import { HeartbeatsController } from './heartbeats/heartbeats.controller';
import { HeartbeatsService } from './heartbeats/heartbeats.service';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';
import { PulsesController } from './pulses/pulses.controller';
import { PulsesService } from './pulses/pulses.service';
import { SchedulesController } from './schedules/schedules.controller';
import { SchedulesService } from './schedules/schedules.service';
import { TargetsController } from './targets/targets.controller';
import { TargetsService } from './targets/targets.service';
import { UrlsController } from './urls/urls.controller';
import { UrlsService } from './urls/urls.service';

@Module({
  imports: [DalModule, CoreModule, AuthorizationModule],
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
  exports: [UrlsService, PulsesService, HeartbeatsService],
})
export class AssessmentsModule {}
