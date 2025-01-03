import { StandardUnit } from '@aws-sdk/client-cloudwatch';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CloudWatchService } from '../cloudwatch/cloudwatch.service';

type MetricType = 'Request' | 'Success' | 'Error';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    private readonly cloudWatchService: CloudWatchService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Intercepts HTTP requests and responses to send metrics to CloudWatch.
   *
   * @param context - The execution context of the request.
   * @param next - The next handler in the request pipeline.
   * @returns An observable that continues the request handling and sends metrics.
   *
   * Metrics sent:
   * - RequestCount: Number of requests received.
   * - SuccessCount: Number of successful responses.
   * - ResponseTime: Time taken to respond to the request.
   * - ErrorCount: Number of failed responses.
   * - StatusCode-<code>: Number of responses with a specific status code.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method } = request;
    const startTime = Date.now();

    /**
     * Get the controller name and endpoint from the request context.
     */
    const controllerName = context.getClass().name;
    const handler = context.getHandler();
    const endpoint = this.reflector.get<string>('path', handler);

    /**
     * Continue with the request.
     */
    return next.handle().pipe(
      tap(() => {
        this.sendCountMetric('Request', controllerName, method, endpoint);
        this.sendCountMetric('Success', controllerName, method, endpoint);
        this.sendLatencyMetric(startTime, controllerName, method, endpoint);
      }),
      catchError((err) => {
        const statusCode = err.status || 500;
        this.sendCountMetric('Error', controllerName, method, endpoint);
        this.sendCountMetric('Request', controllerName, method, endpoint);
        this.sendLatencyMetric(startTime, controllerName, method, endpoint);

        /**
         * Send a metric for the specific status code.
         */
        this.cloudWatchService.sendMetric(`StatusCode-${statusCode}`, 1, {
          Method: method,
          Endpoint: endpoint,
        });

        throw err;
      }),
    );
  }

  /**
   * Sends a count metric to CloudWatch.
   *
   * @param type - The type of the metric.
   * @param controllerName - The name of the controller.
   * @param method - The method being executed.
   * @param endpoint - The endpoint being accessed.
   * @returns A promise that resolves when the metric has been sent.
   */
  private async sendCountMetric(
    type: MetricType,
    controllerName: string,
    method: string,
    endpoint: string,
  ) {
    this.cloudWatchService.sendMetric(`${type}Count`, 1, {
      Controller: controllerName || 'UnknownController',
      Method: method,
      Endpoint: endpoint || 'UnknownEndpoint',
    });
  }

  /**
   * Sends a latency metric to CloudWatch.
   *
   * @param startTime - The start time of the request in milliseconds.
   * @param controllerName - The name of the controller handling the request.
   * @param method - The HTTP method of the request.
   * @param endpoint - The endpoint being accessed.
   */
  private async sendLatencyMetric(
    startTime: number,
    controllerName: string,
    method: string,
    endpoint: string,
  ) {
    const responseTime = Date.now() - startTime;
    /**
     * Send a metric for the response time.
     */
    this.cloudWatchService.sendMetric(
      'ResponseTime',
      responseTime,
      {
        Controller: controllerName || 'UnknownController',
        Method: method,
        Endpoint: endpoint || 'UnknownEndpoint',
      },
      StandardUnit.Milliseconds,
    );
  }
}
