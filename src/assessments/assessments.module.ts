import { Module } from '@nestjs/common';
import { PulsesController } from './pulses/pulses.controller';
import { PulsesService } from './pulses/pulses.service';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';
import { UrlsService } from './urls/urls.service';
import { UrlsController } from './urls/urls.controller';
import { TargetsService } from './targets/targets.service';
import { TargetsController } from './targets/targets.controller';

@Module({
  controllers: [
    PulsesController,
    ProjectsController,
    UrlsController,
    TargetsController,
  ],
  providers: [PulsesService, ProjectsService, UrlsService, TargetsService],
})
export class AssessmentsModule {}
