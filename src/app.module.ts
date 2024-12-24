import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorizationModule } from './authorization/authorization.module';
import { CoreModule } from './core/core.module';
import { DalModule } from './dal/dal.module';
import { SettingsModule } from './settings/settings.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CoreModule,
    DalModule,
    SettingsModule,
    AuthorizationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
