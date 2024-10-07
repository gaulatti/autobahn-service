import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthorizationModule } from './authorization/authorization.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { EngineModule } from './engine/engine.module';
import { SettingsModule } from './settings/settings.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { join } from 'path';
import { Team } from './models/team.model';
import { Membership } from './models/membership.model';
import { Project } from './models/project.model';
import { User } from './models/user.model';
import { Assignment } from './models/assignment.model';
import { Pulse } from './models/pulse.model';
import { Schedule } from './models/schedule.model';
import { Target } from './models/target.model';
import { Url } from './models/url.model';
import { Heartbeat } from './models/heartbeat.model';
import { Baseline } from './models/baseline.model';
import { Statistic } from './models/statistic.model';
import { Engagement } from './models/engagement.model';

/**
 * The main application module.
 *
 * This module imports the configuration module, sets up the application controller,
 * and provides the application service.
 *
 * @module AppModule
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        models: [join(__dirname, '**/*.model.ts')],
        autoLoadModels: true,
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([
      Team,
      Membership,
      Project,
      User,
      Assignment,
      Pulse,
      Schedule,
      Target,
      Url,
      Heartbeat,
      Baseline,
      Statistic,
      Engagement,
    ]),
    AuthorizationModule,
    AssessmentsModule,
    EngineModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
