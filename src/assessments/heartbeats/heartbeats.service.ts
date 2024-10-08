import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Heartbeat } from 'src/models/heartbeat.model';
import { streamToString } from 'src/utils/s3';
import { Readable } from 'stream';
import { PulsesService } from '../pulses/pulses.service';

/**
 * Service for retrieving heartbeats from S3.
 */
const client = new S3Client();

/**
 * The SNS client.
 */
const snsClient = new SNSClient();

@Injectable()
export class HeartbeatsService {
  constructor(
    private readonly pulsesService: PulsesService,
    @InjectModel(Heartbeat) private readonly heartbeat: typeof Heartbeat,
  ) {}

  async getHeartbeat(uuid: string, isMobile = false): Promise<string> {
    const bucketName = process.env.BUCKET_NAME;
    const key = `${uuid}.${isMobile ? 'mobile' : 'desktop'}.json`;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await client.send(command);
    return streamToString(response.Body as Readable);
  }

  async getHeartbeatJSON(
    uuid: string,
    isMobile = false,
    minified = false,
  ): Promise<Record<string, unknown>> {
    const bucketName = process.env.BUCKET_NAME;
    const key = `${uuid}.${isMobile ? 'mobile' : 'desktop'}${minified ? '.min' : ''}.json`;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

    return { signedUrl };
  }

  async retryHeartbeat(uuid: string, isMobile = false) {
    /**
     * Retrieve the viewport ID from the path parameters.
     */
    const viewportIndex = isMobile ? 0 : 1;
    const pulse = await this.pulsesService.getPulse(uuid);

    const {
      url: { url },
    } = pulse;
    const { id, retries } = pulse.heartbeats.find(
      ({ mode }: { mode: number }) => mode === viewportIndex,
    );

    /**
     * Update the retries count
     */
    this.heartbeat.update({ retries: retries + 1 }, { where: { id } });

    /**
     * Re-trigger the execution.
     */
    const command = new PublishCommand({
      Message: JSON.stringify({
        url: url,
        uuid,
        mode: isMobile ? 'mobile' : 'desktop',
      }),
      TopicArn: process.env.TRIGGER_TOPIC_ARN,
    });

    const execution = await snsClient.send(command);

    return { execution };
  }
}
