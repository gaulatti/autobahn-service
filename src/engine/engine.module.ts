import { Module } from '@nestjs/common';
import { AssessmentsModule } from 'src/assessments/assessments.module';
import { AuthorizationModule } from 'src/authorization/authorization.module';
import { CoreModule } from 'src/core/core.module';
import { DalModule } from 'src/dal/dal.module';
import { PlatformsService } from './platforms/platforms.service';
import { PlaylistsController } from './playlists/playlists.controller';
import { PlaylistsService } from './playlists/playlists.service';
import { PluginsController } from './plugins/plugins.controller';
import { PluginsService } from './plugins/plugins.service';
import { StrategiesController } from './strategies/strategies.controller';
import { StrategiesService } from './strategies/strategies.service';
import { TriggersService } from './triggers/triggers.service';

@Module({
  controllers: [PlaylistsController, PluginsController, StrategiesController],
  imports: [DalModule, CoreModule, AssessmentsModule, AuthorizationModule],
  providers: [
    PlaylistsService,
    StrategiesService,
    PluginsService,
    TriggersService,
    PlatformsService,
  ],
})
export class EngineModule {}
