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

@Module({
  imports: [DalModule],
  controllers: [
    PulsesController,
    ProjectsController,
    UrlsController,
    TargetsController,
    HeartbeatsController,
  ],
  providers: [
    PulsesService,
    ProjectsService,
    UrlsService,
    TargetsService,
    HeartbeatsService,
  ],
})
export class AssessmentsModule {}
