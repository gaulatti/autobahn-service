import { Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { AuthorizationGuard } from './authorization/authorization.guard';
import { logger } from './utils/logger';

/**
 * Sets the logger for the application to the JsonLogger.
 */
Logger.overrideLogger(logger);

/**
 * Initializes and starts the NestJS application using the Fastify adapter.
 *
 * - If the module is the main module, it starts the application on port 3000.
 * - If the module is not the main module, it initializes the application and returns the instance.
 *
 * @returns {Promise<void | NestFastifyApplication>} A promise that resolves to void if the application is started, or to the application instance if initialized.
 */
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
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthorizationGuard(reflector));

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap();
