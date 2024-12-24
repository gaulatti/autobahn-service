import {
  CloudWatchClient,
  PutMetricDataCommand,
  StandardUnit,
} from '@aws-sdk/client-cloudwatch';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Service for sending metrics to AWS CloudWatch.
 */
@Injectable()
export class CloudWatchService {
  /**
   * Logger instance for logging errors and information.
   */
  private readonly logger = new Logger(CloudWatchService.name);

  /**
   * AWS CloudWatch client instance.
   */
  private cloudWatchClient: CloudWatchClient;

  /**
   * Constructs a new CloudWatchService instance.
   * Initializes the CloudWatch client with the AWS region from environment variables.
   */
  constructor() {
    this.cloudWatchClient = new CloudWatchClient({
      region: process.env.AWS_REGION,
    });
  }

  /**
   * Sends a custom metric to AWS CloudWatch.
   *
   * @param metricName - The name of the metric.
   * @param value - The value of the metric.
   * @param dimensions - An optional record of dimensions for the metric. Defaults to an empty object.
   * @param unit - The unit of the metric. Defaults to `StandardUnit.Count`.
   *
   * @returns A promise that resolves when the metric is successfully sent.
   *
   * @throws Will log an error message if the metric fails to send.
   */
  async sendMetric(
    metricName: string,
    value: number,
    dimensions: Record<string, string> = {},
    unit: StandardUnit = StandardUnit.Count,
  ) {
    /**
     * Convert the dimensions object to an array of dimension objects.
     */
    const dimensionsArray = Object.keys(dimensions).map((key) => ({
      Name: key,
      Value: dimensions[key],
    }));

    /**
     * Add a dimension for the stage of the application.
     */
    dimensionsArray.push({
      Name: 'Stage',
      Value: process.env.CONTAINERIZED === 'true' ? 'Prod' : 'Local',
    });

    /**
     * Parameters for the PutMetricDataCommand.
     */
    const params = {
      Namespace: 'Autobahn/Metrics',
      MetricData: [
        {
          MetricName: metricName,
          Value: value,
          Dimensions: dimensionsArray,
          Unit: unit,
        },
      ],
    };

    try {
      /**
       * Send the metric to CloudWatch.
       */
      const command = new PutMetricDataCommand(params);
      await this.cloudWatchClient.send(command);
    } catch (error) {
      this.logger.error(
        `Failed to send metric ${metricName}: ${error.message}`,
      );
    }
  }
}
