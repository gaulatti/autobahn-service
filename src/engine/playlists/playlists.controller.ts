import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import axios from 'axios';
import { Logger } from 'src/decorators/logger.decorator';
import { User } from 'src/models/user.model';
import { JSONLogger } from 'src/utils/logger';
import { PlaylistsDto } from './playlists.dto';
import { PlaylistsService } from './playlists.service';
/**
 * Controller for handling playlist-related operations.
 *
 * This controller provides endpoints to start and update playlists based on incoming messages.
 * It also handles subscription confirmations.
 */
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistService: PlaylistsService) {}

  /**
   * Logger instance for logging messages.
   */
  @Logger(PlaylistsController.name)
  private readonly logger!: JSONLogger;

  /**
   * Creates a new pulse.
   *
   * @param dto - The data transfer object containing the details of the pulse to be created.
   * @returns The created pulse.
   */
  @Post('/adhoc')
  adhocTrigger(@Body() dto: PlaylistsDto, @Request() { user }: { user: User }) {
    return this.playlistService.manualTrigger(dto, user);
  }

  /**
   * Handles the start of a playlist based on the incoming message type.
   *
   * @param body - The request body containing the message details.
   * @returns A promise that resolves when the playlist has been started or the subscription has been confirmed.
   *
   * The function checks the type of the incoming message:
   * - If the message type is 'Notification', it starts the playlist using the message content.
   */
  @Post()
  async triggerPlaylist(@Body() body: any) {
    const parsedBody = JSON.parse(body);
    const messageType = parsedBody['Type'];
    this.logger.log('trigger', JSON.stringify(parsedBody));
    if (messageType === 'SubscriptionConfirmation') {
      /**
       * This will be removed as soon as the subscription is confirmed.
       */
      const subscribeUrl = parsedBody['SubscribeURL'];
      await this.confirmSubscription(subscribeUrl);
    } else if (messageType === 'Notification') {
      /**
       * If the message type is 'Notification', start the playlist.
       */
      const message = JSON.parse(parsedBody['Message']);
      await this.playlistService.trigger(message);
    }
  }

  /**
   * Handles the update of a playlist based on the incoming message type.
   *
   * @param body - The request body containing the message details.
   * @returns A promise that resolves when the playlist has been updated or the subscription has been confirmed.
   *
   * The function checks the type of the incoming message:
   * - If the message type is 'Notification', it updates the playlist using the message content.
   */
  @Post('update')
  async seguePlaylist(@Body() body: any) {
    const parsedBody = JSON.parse(body);
    const messageType = parsedBody['Type'];
    this.logger.log('update', JSON.stringify(parsedBody));
    if (messageType === 'SubscriptionConfirmation') {
      /**
       * This will be removed as soon as the subscription is confirmed.
       */
      const subscribeUrl = parsedBody['SubscribeURL'];
      await this.confirmSubscription(subscribeUrl);
    } else if (messageType === 'Notification') {
      /**
       * If the message type is 'Notification', start the playlist.
       */
      const message = JSON.parse(parsedBody['Message']);
      await this.playlistService.segue(message);
    }
  }

  @Get()
  async getPlaylists(
    @Query('sort') sort: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query('startRow') startRow: number,
    @Query('endRow') endRow: number,
  ) {
    return this.playlistService.getPlaylists(sort, from, to, startRow, endRow);
  }

  @Get(':slug')
  async getPlaylist(@Param('slug') slug: string) {
    return this.playlistService.getPlaylist(slug);
  }

  /**
   * Confirms a subscription by sending a GET request to the provided URL.
   *
   * @param subscribeUrl - The URL to send the GET request to for confirming the subscription.
   * @returns A promise that resolves when the subscription is confirmed.
   * @throws Will log an error message if the subscription confirmation fails.
   */
  private async confirmSubscription(subscribeUrl: string) {
    try {
      await axios.get(subscribeUrl);
      this.logger.log('Subscription confirmed.');
    } catch (error) {
      this.logger.error('Error confirming subscription:', error);
    }
  }
}
