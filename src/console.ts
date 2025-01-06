import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BackupService } from './dal/backup/backup.service';

/**
 * The bootstrap function initializes the application context and executes a command based on the provided arguments.
 *
 * It supports the following commands:
 * - 'db:backup': Backs up the database using the BackupService.
 *
 * If an unknown command is provided, it logs 'Command not found' and exits with a status code of 1.
 *
 * After executing the command, it closes the application context and exits with a status code of 0.
 *
 * @returns {Promise<void>} A promise that resolves when the function completes.
 */
async function bootstrap(): Promise<void> {
  const application = await NestFactory.createApplicationContext(AppModule);

  const command = process.argv[2];

  switch (command) {
    /**
     * Backs up the database using the BackupService.
     */
    case 'db:backup':
      const usersService = application.get(BackupService);
      await usersService.backupDatabase();
      break;

    /**
     * Handle unknown commands.
     */
    default:
      console.log('Command not found');
      process.exit(1);
  }

  await application.close();
  process.exit(0);
}

bootstrap();
