import { Module } from '@nestjs/common';
import { DalModule } from 'src/dal/dal.module';
import { PlaylistsController } from './playlists/playlists.controller';
import { PlaylistsService } from './playlists/playlists.service';
import { PluginsService } from './plugins/plugins.service';
import { StrategiesService } from './strategies/strategies.service';
import { TriggersService } from './triggers/triggers.service';
import { CoreModule } from 'src/core/core.module';
import { AssessmentsModule } from 'src/assessments/assessments.module';

@Module({
  controllers: [PlaylistsController],
  imports: [DalModule, CoreModule, AssessmentsModule],
  providers: [
    PlaylistsService,
    StrategiesService,
    PluginsService,
    TriggersService,
  ],
})
export class EngineModule {}
