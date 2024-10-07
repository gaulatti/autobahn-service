import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { AuthorizationGuard } from './authorization/authorization.guard';
import { INestApplication } from '@nestjs/common';

/**
 * Initializes and configures the NestJS application using the Fastify adapter.
 *
 * - Creates an instance of the NestJS application.
 * - Enables Cross-Origin Resource Sharing (CORS).
 * - Sets the global guard to `AuthorizationGuard`.
 * - If the module is the main module, starts the application on port 3000.
 *
 * @returns {Promise<void | INestApplication>} A promise that resolves when the application is started or returns the application instance.
 */
const bootstrap = async (): Promise<void | INestApplication> => {
  console.log(require.main === module);
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
   * If the module is the main module, starts the application on port 3000.
   * This allows dual usage, either locally or within Lambda.
   */
  if (require.main === module) {
    /**
     * Starts the application on port 3000.
     */
    await app.listen(3000, (err) => {
      if (err) console.error(err);
      console.log('Madonna listening on 3000');
    });
  } else {
    /**
     * Returns the application instance.
     */
    return app;
  }
};

bootstrap();
