import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CwvMetric } from 'src/models/cwv.metric.model';
import { Heartbeat } from 'src/models/heartbeat.model';
import { LighthouseScore } from 'src/models/lighthouse.score.model';
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

/**
 * Service responsible for handling heartbeat-related operations.
 */
@Injectable()
export class HeartbeatsService {
  /**
   * Constructs a new instance of the HeartbeatsService.
   *
   * @param pulsesService - The PulsesService instance to be injected.
   * @param heartbeat - The Heartbeat model to be injected.
   */
  constructor(
    @Inject(forwardRef(() => PulsesService))
    private readonly pulsesService: PulsesService,
    @InjectModel(Heartbeat) private readonly heartbeat: typeof Heartbeat,
    @InjectModel(CwvMetric) private readonly cwvMetric: typeof CwvMetric,
    @InjectModel(LighthouseScore)
    private readonly lighthouseScore: typeof LighthouseScore,
  ) {}

  /**
   * Retrieves the heartbeat data for a given slug and device type (mobile or desktop).
   *
   * @param slug - The unique identifier for the heartbeat data.
   * @param isMobile - A boolean indicating whether the request is for a mobile device.
   * @returns A promise that resolves to a string containing the heartbeat data.
   *
   * @throws Will throw an error if the heartbeat data cannot be retrieved.
   */
  async getHeartbeat(slug: string, isMobile: boolean): Promise<string> {
    const bucketName = process.env.BUCKET_NAME;
    const key = `${slug}.${isMobile ? 'mobile' : 'desktop'}.json`;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await client.send(command);
    return streamToString(response.Body as Readable);
  }

  /**
   * Retrieves a signed URL for a heartbeat JSON file stored in an S3 bucket.
   *
   * @param slug - The unique identifier for the heartbeat file.
   * @param isMobile - A boolean indicating whether the file is for a mobile device.
   * @param minified - A boolean indicating whether the file should be minified. Defaults to false.
   * @returns A promise that resolves to an object containing the signed URL.
   */
  async getHeartbeatJSON(
    slug: string,
    isMobile: boolean,
    minified = false,
  ): Promise<Record<string, unknown>> {
    const bucketName = process.env.BUCKET_NAME;
    const key = `${slug}.${isMobile ? 'mobile' : 'desktop'}${minified ? '.min' : ''}.json`;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

    return { signedUrl };
  }

  /**
   * Retries a heartbeat for a given slug. This function retrieves the pulse data,
   * updates the retry count for the corresponding heartbeat, and re-triggers the execution.
   *
   * @param {string} slug - The unique identifier for the heartbeat.
   * @param {boolean} [isMobile=false] - Flag indicating if the heartbeat is for a mobile device.
   * @returns {Promise<{ execution: any }>} - The execution result of the re-triggered heartbeat.
   */
  async retryHeartbeat(slug: string, isMobile = false) {
    /**
     * Retrieve the viewport ID from the path parameters.
     */
    const viewportIndex = isMobile ? 0 : 1;
    const pulse = await this.pulsesService.getPulse(slug);

    const {
      url: { url },
    } = pulse;
    const { id, retries } = pulse.heartbeats.find(
      ({ mode }: { mode: number }) => mode === viewportIndex,
    );

    /**
     * Update the retries count
     */
    this.heartbeat.update(
      { retries: retries + 1, status: 6 },
      { where: { id } },
    );

    /**
     * Re-trigger the execution.
     */
    const command = new PublishCommand({
      Message: JSON.stringify({
        url: url,
        slug,
        mode: isMobile ? 'mobile' : 'desktop',
      }),
      TopicArn: process.env.TRIGGER_TOPIC_ARN,
    });

    const execution = await snsClient.send(command);

    return { execution };
  }

  /**
   * Triggers a heartbeat by creating a heartbeat record and publishing a message to an SNS topic.
   *
   * @param slug - The unique identifier for the heartbeat.
   * @param url - The URL to be included in the heartbeat message.
   * @param isMobile - A boolean indicating if the heartbeat is for a mobile device.
   * @param id - The identifier for the heartbeat record.
   * @returns An object containing the execution result of the SNS publish command.
   */
  async triggerHeartbeat(
    slug: string,
    url: string,
    isMobile: boolean,
    id: number,
  ) {
    /**
     * Create the heartbeat record.
     */
    await this.createHeartbeat(isMobile, id);

    /**
     * Trigger the execution.
     */
    const command = new PublishCommand({
      Message: JSON.stringify({
        url: url,
        slug,
        mode: isMobile ? 'mobile' : 'desktop',
      }),
      TopicArn: process.env.TRIGGER_TOPIC_ARN,
    });
    const execution = await snsClient.send(command);

    return { execution };
  }

  /**
   * Creates a heartbeat record.
   *
   * @param {boolean} isMobile - Indicates if the heartbeat is from a mobile device.
   * @param {number} id - The ID associated with the heartbeat.
   * @returns {Promise<any>} A promise that resolves to the created heartbeat record.
   */
  async createHeartbeat(isMobile: boolean, id: number) {
    /**
     * Create the heartbeat record.
     */
    return await this.heartbeat.create({
      pulseId: id,
      mode: isMobile ? 0 : 1,
      status: 0,
    });
  }

  /**
   * Adds Core Web Vitals (CWV) metrics to the database.
   *
   * @param input - An object containing the following properties:
   * @param input.id - The ID of the heartbeat.
   * @param input.ttfb - Time to First Byte (TTFB) metric.
   * @param input.si - Speed Index (SI) metric.
   * @param input.cls - Cumulative Layout Shift (CLS) metric.
   * @param input.dcl - DOM Content Loaded (DCL) metric.
   * @param input.fcp - First Contentful Paint (FCP) metric.
   * @param input.lcp - Largest Contentful Paint (LCP) metric.
   * @param input.tbt - Total Blocking Time (TBT) metric.
   * @param input.tti - Time to Interactive (TTI) metric.
   * @returns A promise that resolves to the created CWV metric record.
   */
  async addCwvMetrics(input: {
    id: number;
    ttfb: number;
    si: number;
    cls: number;
    dcl: number;
    fcp: number;
    lcp: number;
    tbt: number;
    tti: number;
  }) {
    return await this.cwvMetric.create({
      heartbeatId: input.id,
      ttfb: input.ttfb,
      si: input.si,
      cls: input.cls,
      dcl: input.dcl,
      fcp: input.fcp,
      lcp: input.lcp,
      tbt: input.tbt,
      tti: input.tti,
    });
  }

  /**
   * Adds Lighthouse scores to the database for a given heartbeat.
   *
   * @param input - An object containing the Lighthouse scores and the heartbeat ID.
   * @param input.id - The ID of the heartbeat.
   * @param input.performance - The performance score.
   * @param input.accessibility - The accessibility score.
   * @param input.bestPractices - The best practices score.
   * @param input.seo - The SEO score.
   * @returns A promise that resolves to the created Lighthouse score record.
   */
  async addLighthouseScores(input: {
    id: number;
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  }) {
    return await this.lighthouseScore.create({
      heartbeatId: input.id,
      performanceScore: input.performance,
      accessibilityScore: input.accessibility,
      bestPracticesScore: input.bestPractices,
      seoScore: input.seo,
    });
  }
}
