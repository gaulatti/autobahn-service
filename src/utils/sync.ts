import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { execSync } from 'child_process';
import { config } from 'dotenv';
import { createWriteStream } from 'fs';
import { join } from 'path';

/**
 * Initialize dotenv to get DB Credentials
 */
config();

/**
 * The AWS Secrets Manager client.
 */
const secretsClient = new SecretsManagerClient();

/**
 * The AWS S3 client.
 */
const s3Client = new S3Client();

/**
 * Fetches database credentials either from AWS Secrets Manager or from environment variables.
 *
 * If the `DB_CREDENTIALS` environment variable is set, it retrieves the credentials from AWS Secrets Manager.
 * Otherwise, it falls back to using the `DB_USERNAME` and `DB_PASSWORD` environment variables.
 *
 * @returns {Promise<{username: string, password: string}>} An object containing the database username and password.
 */
const fetchDatabaseCredentials = async (): Promise<{
  username: string;
  password: string;
  host: string;
}> => {
  if (process.env.DB_USERNAME && process.env.DB_PASSWORD) {
    return {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
    };
  } else if (process.env.DB_CREDENTIALS) {
    const command = new GetSecretValueCommand({
      SecretId: process.env.DB_CREDENTIALS,
    });

    const response = await secretsClient.send(command);
    const secret = JSON.parse(response.SecretString || '{}');
    return {
      username: secret.username,
      password: secret.password,
      host: process.env.DB_HOST_RDS,
    };
  }

  /**
   * If no credentials are provided, throw an error.
   */
  throw new Error('Database credentials are not provided.');
};

/**
 * Fetches the most recent database backup file from an S3 bucket and saves it to a local path.
 *
 * This function performs the following steps:
 * 1. Lists objects in the specified S3 bucket under the 'backups/' prefix.
 * 2. Identifies the most recent backup file based on the LastModified date.
 * 3. Downloads the most recent backup file.
 * 4. Saves the downloaded file to a local path.
 *
 * @returns {Promise<string>} The local path where the backup file is saved.
 * @throws {Error} If no backup files are found in the S3 bucket.
 */
const fetchDatabaseBackup = async (): Promise<string> => {
  const bucketName = process.env.ASSETS_BUCKET_NAME;

  if (!bucketName) {
    throw new Error('Bucket name is not defined in environment variables.');
  }

  let continuationToken: string | undefined;
  let allContents: Array<{ Key?: string; LastModified?: Date }> = [];

  /**
   * Fetch all the objects in the S3 bucket with the prefix 'backups/'
   */
  do {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: 'backups/',
      ContinuationToken: continuationToken,
    });

    const listResponse = await s3Client.send(listCommand);
    if (listResponse.Contents) {
      allContents = [...allContents, ...listResponse.Contents];
    }

    continuationToken = listResponse.NextContinuationToken;
  } while (continuationToken);

  if (allContents.length === 0) {
    throw new Error('No backup files found in S3 bucket');
  }

  /**
   * Find the latest backup file based on the LastModified date.
   */
  const latestFile = allContents.reduce((latest, current) =>
    latest.LastModified &&
    current.LastModified &&
    latest.LastModified > current.LastModified
      ? latest
      : current,
  );

  if (!latestFile.Key) {
    throw new Error('Latest file does not have a valid key.');
  }

  console.log(`Latest backup file found: ${latestFile.Key}`);

  /**
   * Download the latest backup file from S3.
   */
  const getCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: latestFile.Key,
  });

  const { Body } = await s3Client.send(getCommand);
  if (!Body) {
    throw new Error('Failed to retrieve backup file body from S3.');
  }

  const backupPath = join('/tmp', 'backup.sql');

  const writeStream = createWriteStream(backupPath);
  const bodyStream = Body.transformToWebStream();
  const readableStream = bodyStream.getReader();
  const pump = () =>
    readableStream.read().then(({ done, value }) => {
      if (done) {
        writeStream.end();
        return;
      }
      writeStream.write(value, pump);
    });

  pump();

  await new Promise((resolve) => writeStream.on('finish', resolve));
  return backupPath;
};

/**
 * Synchronizes the database by performing the following steps:
 * 1. Drops the existing database.
 * 2. Creates a new database.
 * 3. Applies a backup to the newly created database.
 *
 * Environment Variables:
 * - `DB_HOST`: The host of the database.
 * - `DB_PORT`: The port of the database.
 * - `DB_DATABASE`: The name of the database.
 *
 * @async
 * @function syncDatabase
 * @returns {Promise<void>} A promise that resolves when the database synchronization is complete.
 */
const syncDatabase = async (): Promise<void> => {
  const { DB_HOST, DB_PORT, DB_DATABASE } = process.env;

  /**
   * Obvious reasons. No one wants to drop the production database.
   * https://www.youtube.com/watch?v=i_cVJgIz_Cs
   */
  if (DB_DATABASE === 'autobahn') {
    throw new Error("You cannot sync to the autobahn database. That's PROD.");
  }

  const credentials = await fetchDatabaseCredentials();
  const { username, password } = credentials;

  execSync(
    `mysqladmin -h ${DB_HOST} -P ${DB_PORT} -u ${username} -p${password} drop ${DB_DATABASE} -f`,
  );

  execSync(
    `mysqladmin -h ${DB_HOST} -P ${DB_PORT} -u ${username} -p${password} create ${DB_DATABASE}`,
  );

  const backupSql = await fetchDatabaseBackup();
  execSync(
    `mysql -h ${DB_HOST} -P ${DB_PORT} -u ${username} -p${password} ${DB_DATABASE} < ${backupSql}`,
  );
  console.log(`Database backup applied from ${backupSql}`);
};

syncDatabase().catch((err) => {
  console.error('Error during database synchronization:', err);
});
