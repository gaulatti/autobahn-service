import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { AuthorizationGuard } from './authorization/authorization.guard';

/**
 * Initializes and starts the NestJS application using the Fastify adapter.
 *
 * This function creates an instance of the NestJS application with the specified
 * module and adapter, and then listens on port 3000.
 *
 * @async
 * @function bootstrap
 * @returns {Promise<void>} A promise that resolves when the application has started.
 */
const bootstrap = async (): Promise<void> => {
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

  /**
   * Starts the application on port 3000.
   */
  await app.listen(3000);
};

bootstrap();
