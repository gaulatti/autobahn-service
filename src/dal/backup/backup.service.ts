import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { exec } from 'child_process';
import * as fs from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * Service responsible for performing database backups and uploading them to S3.
 */
@Injectable()
export class BackupService {
  /**
   * Logger instance for logging messages.
   */
  private readonly logger = new Logger(BackupService.name);

  /**
   * S3 client for interacting with AWS S3.
   */
  private readonly s3Client = new S3Client();

  /**
   * Secrets Manager client for retrieving database credentials.
   */
  private readonly secretsClient = new SecretsManagerClient({
    region: process.env.AWS_REGION,
  });

  /**
   * Name of the S3 bucket where backups will be stored.
   */
  private readonly bucketName = process.env.ASSETS_BUCKET_NAME;

  /**
   * Backs up the database by performing the following steps:
   * 1. Retrieves the database credentials.
   * 2. Generates a SQL dump file using `mysqldump` and saves it to a temporary file.
   * 3. Uploads the SQL dump file to an S3 bucket.
   * 4. Deletes the temporary SQL dump file.
   * 5. Logs the success or failure of the backup process.
   *
   * @throws Will log an error message if the backup process fails at any step.
   */
  @Cron('0 0 * * *')
  async backupDatabase(): Promise<void> {
    try {
      if (
        process.env.DB_HOST === 'localhost' ||
        process.env.DB_DATABASE !== 'autobahn'
      ) {
        this.logger.error(
          'Database backup is not supported when using a local database.',
        );

        return;
      }

      const { host, port, username, password, database } =
        await this.getDatabaseCredentials();
      const sqlFilePath = `/tmp/backup-${process.env.DB_DATABASE.toLowerCase()}-${new Date().toISOString()}.sql`;

      await execPromise(
        `mysqldump -h ${host} -P ${port} -u ${username} -p${password} ${database} > ${sqlFilePath}`,
      );

      await this.uploadToS3(sqlFilePath);
      fs.unlinkSync(sqlFilePath);

      this.logger.log(
        'Database backup completed and uploaded to S3 successfully.',
      );
    } catch (error) {
      this.logger.error('Database backup failed:', error);
    }
  }

  /**
   * Retrieves the database credentials from AWS Secrets Manager.
   *
   * @returns {Promise<{ user: string, password: string }>} A promise that resolves to an object containing the database username and password.
   * @throws Will throw an error if the secret cannot be retrieved or parsed.
   */
  private async getDatabaseCredentials(): Promise<{
    host: string;
    port: string;
    username: string;
    password: string;
    database: string;
  }> {
    const command = new GetSecretValueCommand({
      SecretId: process.env.DB_CREDENTIALS,
    });
    const response = await this.secretsClient.send(command);
    const secret = JSON.parse(response.SecretString);

    return secret;
  }

  /**
   * Uploads a file to an S3 bucket.
   *
   * @param filePath - The path to the file that needs to be uploaded.
   * @returns A promise that resolves when the upload is complete.
   *
   * @throws Will throw an error if the upload fails.
   */
  private async uploadToS3(filePath: string) {
    const fileStream = fs.createReadStream(filePath);
    const key = `backups/backup-${new Date().toISOString()}.sql`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: fileStream,
    });

    await this.s3Client.send(command);
    this.logger.log(`Backup uploaded to S3 with key: ${key}`);
  }
}