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
    AuthorizationModule,
    AssessmentsModule,
    EngineModule,
    SettingsModule,
  ],
  controllers: [AppController, SettingsController],
  providers: [AppService],
})
export class AppModule {}
