import { Module } from '@nestjs/common';
import { AssessmentsModule } from 'src/assessments/assessments.module';
import { CoreModule } from 'src/core/core.module';
import { DalModule } from 'src/dal/dal.module';
import { PlaylistsController } from './playlists/playlists.controller';
import { PlaylistsService } from './playlists/playlists.service';
import { PluginsController } from './plugins/plugins.controller';
import { PluginsService } from './plugins/plugins.service';
import { StrategiesController } from './strategies/strategies.controller';
import { StrategiesService } from './strategies/strategies.service';
import { TriggersService } from './triggers/triggers.service';

@Module({
  controllers: [PlaylistsController, PluginsController, StrategiesController],
  imports: [DalModule, CoreModule, AssessmentsModule],
  providers: [
    PlaylistsService,
    StrategiesService,
    PluginsService,
    TriggersService,
  ],
})
export class EngineModule {}
