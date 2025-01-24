import { Controller, Get, Param, Patch, Query, Request } from '@nestjs/common';
import { PulsesService } from '../pulses/pulses.service';
import { HeartbeatsService } from './heartbeats.service';

/**
 * Controller for handling heartbeat-related operations.
 *
 * This controller provides endpoints for retrieving heartbeat information,
 * heartbeat JSON data, and retrying heartbeats. It supports both desktop and
 * mobile requests, distinguishing between them based on the URL.
 *
 * @class
 * @classdesc The HeartbeatsController class handles HTTP requests related to heartbeats.
 *
 * @example
 * // Example usage:
 * // GET /desktop/heartbeat/:slug
 * // GET /mobile/heartbeat/:slug
 * // GET /desktop/json/:slug
 * // GET /mobile/json/:slug
 * // PATCH /desktop/retry/:slug
 * // PATCH /mobile/retry/:slug
 *
 * @param {HeartbeatsService} heartbeatsService - The service for handling heartbeat operations.
 * @param {PulsesService} pulsesService - The service for handling pulse operations.
 */
@Controller('pulses/:slug')
export class HeartbeatsController {
  constructor(
    private readonly heartbeatsService: HeartbeatsService,
    private readonly pulsesService: PulsesService,
  ) {}

  /**
   * Retrieves the heartbeat information for a given slug.
   *
   * @param request - The HTTP request object.
   * @param slug - The unique identifier for the pulse.
   * @returns An object containing the target pulse and the heartbeat data.
   */
  @Get(['desktop', 'mobile'])
  async getHeartbeat(@Request() request: Request, @Param('slug') slug: string) {
    const pulse = await this.pulsesService.getPulse(slug);
    const isMobile = request.url.includes('mobile');
    return {
      json: await this.heartbeatsService.getHeartbeat(
        pulse.playlistId ? pulse.playlistId.toString() : slug,
        isMobile,
      ),
    };
  }

  /**
   * Retrieves the heartbeat JSON data.
   *
   * @param request - The HTTP request object.
   * @param slug - The unique identifier for the heartbeat.
   * @param minified - A boolean indicating whether the JSON should be minified. Defaults to `false`.
   * @returns The heartbeat JSON data.
   */
  @Get(['desktop/json', 'mobile/json'])
  async getHeartbeatJSON(
    @Request() request: Request,
    @Param('slug') slug: string,
    @Query('minified') minified?: string,
  ) {
    const pulse = await this.pulsesService.getPulse(slug);
    const isMobile = request.url.includes('mobile');

    return this.heartbeatsService.getHeartbeatJSON(
      pulse.playlistId ? pulse.playlistId.toString() : slug,
      isMobile,
      typeof minified === 'string',
    );
  }

  @Patch(['desktop/retry', 'mobile/retry'])
  /**
   * Retries a heartbeat based on the provided slug.
   * Determines if the request is from a mobile device by checking the URL.
   *
   * @param request - The HTTP request object.
   * @param slug - The slug of the heartbeat to retry.
   * @returns A promise that resolves when the heartbeat retry is complete.
   */
  retryHeartbeat(@Request() request: Request, @Param('slug') slug: string) {
    const isMobile = request.url.includes('mobile');
    return this.heartbeatsService.retryHeartbeat(slug, isMobile);
  }
}
