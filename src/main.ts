import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { JsonLogger } from './utils/logger';
import { AuthorizationGuard } from './authorization/authorization.guard';

/**
 * Sets the logger for the application to the JsonLogger.
 */
if (process.env.CONTAINERIZED === 'true') {
  const jsonLogger = new JsonLogger();
  Logger.overrideLogger(jsonLogger);
}

async function bootstrap() {
  /**
   * Creates an instance of the NestJS application using the Fastify adapter.
   */
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  /**
   * Enables Cross-Origin Resource Sharing (CORS) for the application.
   */
  app.enableCors();

  /**
   * Sets the global guard for the application to the AuthorizationGuard.
   */
  app.useGlobalGuards(new AuthorizationGuard());

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}

bootstrap();
