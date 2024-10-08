import { Injectable } from '@nestjs/common';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { streamToString } from 'src/utils/s3';
import { Readable } from 'stream';

/**
 * Service for retrieving heartbeats from S3.
 */
const client = new S3Client();

@Injectable()
export class HeartbeatsService {
  async getHeartbeatJSON(uuid: string, isMobile = false): Promise<string> {
    const bucketName = process.env.BUCKET_NAME;
    const key = `${uuid}.${isMobile ? 'mobile' : 'desktop'}.json`;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await client.send(command);
    return streamToString(response.Body as Readable);
  }
}
