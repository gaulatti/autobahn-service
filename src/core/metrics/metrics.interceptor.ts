import { StandardUnit } from '@aws-sdk/client-cloudwatch';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CloudWatchService } from '../cloudwatch/cloudwatch.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly cloudWatchService: CloudWatchService) {}

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
    const { method, originalUrl } = request;
    const startTime = Date.now();

    /**
     * Continue with the request.
     */
    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - startTime;

        /**
         * Send a metric for the request count.
         */
        this.cloudWatchService.sendMetric('RequestCount', 1, {
          Method: method,
          Endpoint: originalUrl,
        });

        /**
         * Send a metric for the success count.
         */
        this.cloudWatchService.sendMetric('SuccessCount', 1, {
          Method: method,
          Endpoint: originalUrl,
        });

        /**
         * Send a metric for the response time.
         */
        this.cloudWatchService.sendMetric(
          'ResponseTime',
          responseTime,
          {
            Method: method,
            Endpoint: originalUrl,
          },
          StandardUnit.Milliseconds,
        );
      }),
      catchError((err) => {
        const statusCode = err.status || 500;
        this.cloudWatchService.sendMetric('ErrorCount', 1, {
          Method: method,
          Endpoint: originalUrl,
          StatusCode: statusCode,
        });

        /**
         * Send a metric for the specific status code.
         */
        this.cloudWatchService.sendMetric(`StatusCode-${statusCode}`, 1, {
          Method: method,
          Endpoint: originalUrl,
        });

        throw err;
      }),
    );
  }
}
