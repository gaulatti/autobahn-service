import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthorizationModule } from './authorization/authorization.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { EngineModule } from './engine/engine.module';
import { SettingsModule } from './settings/settings.module';

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
    AuthorizationModule,
    AssessmentsModule,
    EngineModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
