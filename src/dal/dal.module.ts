import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Assignment } from 'src/models/assignment.model';
import { Baseline } from 'src/models/baseline.model';
import { CwvMetric } from 'src/models/cwv.metric.model';
import { Heartbeat } from 'src/models/heartbeat.model';
import { LighthouseScore } from 'src/models/lighthouse.score.model';
import { Membership } from 'src/models/membership.model';
import { Playlist } from 'src/models/playlist.model';
import { Plugin } from 'src/models/plugin.model';
import { Project } from 'src/models/project.model';
import { Pulse } from 'src/models/pulse.model';
import { Slot } from 'src/models/slot.model';
import { Strategy } from 'src/models/strategy.model';
import { Target } from 'src/models/target.model';
import { TargetUrl } from 'src/models/target.url.model';
import { Team } from 'src/models/team.model';
import { Trigger } from 'src/models/trigger.model';
import { Url } from 'src/models/url.model';
import { User } from 'src/models/user.model';
import { BackupService } from './backup/backup.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Assignment,
      Baseline,
      CwvMetric,
      Heartbeat,
      LighthouseScore,
      Membership,
      Playlist,
      Plugin,
      Project,
      Pulse,
      Slot,
      Strategy,
      Target,
      TargetUrl,
      Team,
      Trigger,
      Url,
      User,
    ]),
  ],
  exports: [SequelizeModule],
  providers: [BackupService],
})
export class DalModule {}
