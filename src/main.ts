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
 * - If the module is the main module, it starts the application on port 3000.
 * - If the module is not the main module, it initializes the application and returns the instance.
 *
 * @returns {Promise<void | NestFastifyApplication>} A promise that resolves to void if the application is started, or to the application instance if initialized.
 */
const bootstrap = async (): Promise<void | NestFastifyApplication> => {
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
     * If the module is not the main module, initializes the application.
     */
    await app.init();

    /**
     * Returns the application instance.
     */
    return app;
  }
};

bootstrap();

export { bootstrap };
