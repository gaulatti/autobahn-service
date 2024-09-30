import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

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
const bootstrap = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(3000);
};

bootstrap();
