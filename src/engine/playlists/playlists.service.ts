import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { nanoid } from 'nanoid';
import { Op } from 'sequelize';
import { HeartbeatsService } from 'src/assessments/heartbeats/heartbeats.service';
import { PulsesService } from 'src/assessments/pulses/pulses.service';
import { NotificationsService } from 'src/core/notifications/notifications.service';
import { Logger } from 'src/logger/logger.decorator';
import { Playlist } from 'src/models/playlist.model';
import { Pulse } from 'src/models/pulse.model';
import { Strategy } from 'src/models/strategy.model';
import { getPaginationParams, getSortParams } from 'src/utils/lists';
import { JSONLogger } from 'src/utils/logger';
import { PluginsService } from '../plugins/plugins.service';
import { StrategiesService } from '../strategies/strategies.service';
import { TriggersService } from '../triggers/triggers.service';

/**
 * Service responsible for managing and processing playlists.
 *
 * This service provides methods to monitor scheduled triggers, start playlists based on strategies,
 * and run playlists by executing their sequence of slots.
 *
 * @class
 */
@Injectable()
export class PlaylistsService {
  /**
   * Logger instance for logging messages.
   */
  @Logger(PlaylistsService.name)
  private readonly logger!: JSONLogger;

  /**
   * Constructs an instance of PlaylistsService.
   *
   * @param {PluginsService} pluginsService - The service for managing plugins.
   * @param {TriggersService} triggersService - The service for handling triggers.
   * @param {PulsesService} pulsesService - The service for managing pulses.
   * @param {HeartbeatsService} heartbeatsService - The service for handling heartbeats.
   * @param {UrlsService} urlService - The service for managing URLs.
   * @param {NotificationsService} notificationsService - The service for handling notifications.
   * @param {typeof Playlist} playlist - The model for playlists.
   * @param {typeof Pulse} pulse - The model for pulses.
   */
  constructor(
    @Inject(forwardRef(() => PluginsService))
    private readonly pluginsService: PluginsService,
    private readonly triggersService: TriggersService,
    private readonly pulsesService: PulsesService,
    private readonly heartbeatsService: HeartbeatsService,
    private readonly notificationsService: NotificationsService,
    private readonly strategiesService: StrategiesService,
    @InjectModel(Playlist) private readonly playlist: typeof Playlist,
    @InjectModel(Pulse) private readonly pulse: typeof Pulse,
  ) {}

  /**
   * Retrieves all playlists.
   *
   * @returns {Promise<Playlist[]>} A promise that resolves to an array of playlists.
   */
  async getPlaylists(
    sort: string,
    from?: Date,
    to?: Date,
    startRow?: number,
    endRow?: number,
  ): Promise<{ rows: Playlist[]; count: number }> {
    const paginationParams = getPaginationParams(startRow, endRow);

    return this.playlist.findAndCountAll({
      ...paginationParams,
      order: getSortParams(sort),
      where: {
        createdAt: {
          [Op.between]: [from, to],
        },
      },
      distinct: true,
    });
  }

  /**
   * Retrieves a playlist by its slug.
   *
   * @param slug - The unique identifier for the playlist.
   * @returns A promise that resolves to the playlist object if found, or null if not found.
   */
  async getPlaylist(slug: string) {
    return this.playlist.findOne({ where: { slug } });
  }

  /**
   * Monitors and processes scheduled triggers.
   *
   * This method performs the following steps:
   * 1. Retrieves all due schedules from the triggers service.
   * 2. For each trigger:
   *    - Starts the playlist based on the trigger's strategy.
   *    - Updates the trigger with the next scheduled date.
   *
   * @private
   * @async
   * @returns {Promise<void>} A promise that resolves when all triggers have been processed.
   */
  @Cron('* * * * *')
  private async monitorCron(): Promise<void> {
    const triggers = await this.triggersService.findDueSchedules();

    for (const trigger of triggers) {
      /**
       * Skip beta triggers if the environment is not beta. Same for non-beta triggers.
       */
      if (trigger.context['isBeta'] && process.env.IS_BETA !== 'true') {
        this.logger.log('Skipping beta trigger:', trigger.id);
        continue;
      } else if (!trigger.context['isBeta'] && process.env.IS_BETA == 'true') {
        this.logger.log('Skipping non-beta trigger:', trigger.id);
        continue;
      }

      /**
       * 1. Update the trigger with the next schedule date.
       */
      await this.triggersService.updateNextSchedule(trigger);

      /**
       * 2. Start the playlist
       */
      await this.start(trigger.strategy, { isBeta: trigger.context['isBeta'] });
    }
  }

  /**
   * Starts a playlist based on the provided strategy and context.
   *
   * @param strategy - The strategy object containing slots and other configuration details.
   * @param context - An optional object providing additional context for the playlist.
   * @returns A promise that resolves when the playlist has been started.
   *
   * @remarks
   * This method performs the following steps:
   * 1. Generates the playlist manifest by organizing slots based on their plugin types and order.
   * 2. Creates a new playlist entry in the database with the generated manifest and initial status.
   * 3. Initiates the execution of the playlist.
   */
  private async start(strategy: Strategy, context: object = {}) {
    /**
     * 1. Generate the playlist manifest.
     */
    const manifest = {
      context,
      fqdn: process.env.AUTOBAHN_FQDN,
      sequence: [
        /**
         * Organize slots based on plugin type and order.
         */
        ...strategy.slots.filter((slot) => slot.plugin.pluginType === 'SOURCE'),
        ...strategy.slots
          .filter((slot) => slot.plugin.pluginType === 'PROVIDER')
          .sort((a, b) => a.order - b.order),
        ...strategy.slots
          .filter((slot) => slot.plugin.pluginType === 'PROCESSING')
          .sort((a, b) => a.order - b.order),
        ...strategy.slots
          .filter((slot) => slot.plugin.pluginType === 'DELIVERY')
          .sort((a, b) => a.order - b.order),
      ],
      executed_slots: [],
    };

    const playlist = await this.playlist.create({
      strategiesId: strategy.id,
      manifest,
      status: 'CREATED',
      slug: nanoid(),
      nextStep: manifest.sequence[0]?.plugin.arn,
    });

    /**
     * 2. Start the playlist
     */
    await this.run(playlist);
  }

  /**
   * Runs the playlist with the given ID.
   *
   * This method retrieves the playlist by its primary key, updates its status to 'IN_PROCESS',
   * and then calls the `next` method on the `pluginsService` with the playlist.
   *
   * @param id - The ID of the playlist to run.
   * @returns A promise that resolves when the playlist has been processed.
   */
  private async run(playlist: Playlist) {
    /**
     * Update the playlist status to 'IN_PROCESS' if it is not already in that state.
     */
    if (playlist.status !== 'IN_PROCESS') {
      await playlist.update({ status: 'IN_PROCESS' });
    }

    /**
     * Notify the frontend to refresh the pulses table.
     */
    this.notificationsService.refreshPulsesTable();

    /**
     * Call the `next` method on the `pluginsService` with the playlist.
     */
    await this.pluginsService.next(playlist);
  }

  /**
   * Advances the playlist to the next step. If there are no more steps,
   * the playlist is marked as complete. Otherwise, it updates the playlist
   * with the next step and runs the playlist.
   *
   * @param playlist - The playlist to continue.
   * @returns A promise that resolves when the playlist has been updated and run.
   */
  async continue(playlist: Playlist) {
    /**
     * If there are no more steps, mark the playlist as complete.
     */
    if (!playlist.manifest.sequence.length) {
      await playlist.update({ status: 'COMPLETE', nextStep: null });
    } else {
      await this.run(playlist);
    }
  }

  /** This will be SNS-based. */
  async trigger(message: {
    url: string;
    membership_id: number;
    strategy: number;
    isBeta: boolean;
  }) {
    const { url, membership_id, strategy: strategyId, isBeta } = message;

    /**
     * Skip beta triggers if the environment is not beta. Same for non-beta triggers.
     */
    if (isBeta && process.env.IS_BETA !== 'true') {
      this.logger.log('Skipping beta trigger:', message);
      return;
    } else if (!isBeta && process.env.IS_BETA == 'true') {
      this.logger.log('Skipping non-beta trigger:', message);
      return;
    }

    const strategy = await this.strategiesService.findById(strategyId);
    await this.start(strategy, message);

    this.logger.log('Received SNS notification:', {
      url,
      membership_id,
      strategy,
    });
  }

  /**
   * Updates the status of the given playlist to 'FAILED'.
   *
   * @param {Playlist} playlist - The playlist object to be updated.
   * @returns {Promise<void>} A promise that resolves when the update is complete.
   */
  async crash(playlist: Playlist): Promise<Playlist> {
    return playlist.update({ status: 'FAILED' });
  }

  /**
   * Handles the segue event by updating the last executed slot in the playlist's manifest
   * with the provided output and then continues the playlist execution.
   *
   * @param message - An object containing the output and event information.
   * @param message.output - The output to be assigned to the last executed slot.
   * @param message.event - The event containing the playlist ID.
   * @param message.event.id - The ID of the playlist to be updated.
   * @param message.event.key - The key of the plugin that generated the output.
   * @param message.event.failed - A boolean indicating whether the plugin failed.
   * @returns A promise that resolves when the playlist is updated and continued.
   */
  async segue(message: {
    output: any;
    id: number;
    key: string;
    failed: boolean;
  }) {
    try {
      const { output, id, failed } = message;

      /**
       * Retrieve the playlist by its ID.
       */
      const playlist = await this.playlist.findByPk(id);

      /**
       * Throw an error if the playlist does not exist.
       */
      if (!playlist) {
        throw new Error(`Playlist with ID ${id} not found.`);
      }

      /**
       * Skip beta playlists if the environment is not beta. Same for non-beta playlists.
       */
      if (playlist.manifest.context.isBeta && process.env.IS_BETA !== 'true') {
        this.logger.log('Skipping beta playlist', { id: playlist.id });
        return;
      } else if (
        !playlist.manifest.context.isBeta &&
        process.env.IS_BETA == 'true'
      ) {
        this.logger.log('Skipping non-beta playlist', { id: playlist.id });
        return;
      }

      /**
       * Retrieve the plugin by its key.
       */
      const plugin = await this.pluginsService.getPluginByKey(message.key);
      if (!plugin) {
        throw new Error(`Plugin with key ${message.key} not found.`);
      }

      /**
       * Retrieve the minimum number of outputs required for the plugin.
       */
      const { minOutputs } = playlist.manifest.executed_slots.find(
        (slot: any) => slot.plugin.arn === plugin.arn,
      );

      /**
       * Throw an error if the plugin does not exist in the playlist.
       */
      if (failed) {
        return await this.crash(playlist);
      }

      /**
       * Initialize the output count.
       */
      let outputCount = 0;

      const { arn, pluginType } = plugin;
      if (typeof output === 'object' || typeof output === 'string') {
        if (pluginType === 'SOURCE') {
          playlist.manifest.context.url = output;
        } else {
          /**
           * If the output object does not exist in the playlist context, create it.
           */

          if (!playlist.manifest.context.output) {
            playlist.manifest.context.output = {};
          }

          /**
           * Assign the output to the playlist context.
           */
          if (!playlist.manifest.context.output[arn]) {
            playlist.manifest.context.output[arn] = [];
          }

          /**
           * Add the output to the playlist context.
           */
          if (Object.keys(output).length) {
            playlist.manifest.context.output[arn].push(output);
            outputCount = playlist.manifest.context.output[arn].length;
          }

          /**
           * Internal Outputs Handling: This involves anything that has
           * to do with either Autobahn itself, like saving to the database.
           */
          await this.handleInternalOutputs(playlist, arn, output);
        }
        /**
         * Save the updated playlist.
         */
        playlist.changed('manifest', true);
        await playlist.save();
      }

      if (outputCount >= minOutputs) {
        /**
         * Continue the playlist if the minimum number of outputs has been reached.
         */
        await this.continue(playlist);
      }
    } catch (error) {
      this.logger.error('Fatal on Segue:', JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Handles internal outputs based on the provided Amazon Resource Name (ARN).
   *
   * @param playlist - The playlist object that will be processed.
   * @param arn - The Amazon Resource Name (ARN) that determines the action to be taken.
   * @param output - The output data to be handled.
   * @returns A promise that resolves when the handling is complete.
   */
  async handleInternalOutputs(playlist: Playlist, arn: string, output: any) {
    if (arn.includes('AutobahnStoragePlugin')) {
      await this.storeOutput(playlist, output);
    }
  }

  /**
   * Stores the output of a playlist by processing the allowed plugins.
   *
   * @param playlist - The playlist object containing the manifest and context.
   * @param allowedPlugins - An array of strings representing the allowed plugins.
   *
   * @returns A promise that resolves when the output has been stored.
   *
   * @remarks
   * This method retrieves the URL record by its fully qualified domain name (FQDN),
   * logs the URL and URL record, and processes each allowed plugin. Currently, it only
   * saves the output for the `AutobahnInternalLighthouseProviderPlugin`.
   *
   * For the `AutobahnInternalLighthouseProviderPlugin`, it creates a pulse record for the URL,
   * and then creates a heartbeat record for each output of the plugin. The heartbeat record
   * is updated with the output data, including various performance metrics and scores.
   *
   * The method logs the pulse and playlist ID after processing.
   */
  async storeOutput(playlist: Playlist, allowedPlugins: string[]) {
    const {
      manifest: {
        context: { url, output: pluginOutputs },
      },
    } = playlist;

    for (const plugin of allowedPlugins) {
      /**
       * By now we're only saving the AutobahnInternalLighthouseProviderPlugin
       */
      if (plugin.includes('AutobahnInternalLighthouseProviderPlugin')) {
        /**
         * Create a pulse record for the URL
         */
        const pulse = await this.pulsesService.createPulse({
          url,
          playlistId: playlist.id,
        });

        /**
         * Create a heartbeat record for each output of the plugin.
         */
        for (const item of pluginOutputs[plugin]) {
          const heartbeat = await this.heartbeatsService.createHeartbeat(
            item.simplifiedResult.mode === 'mobile',
            pulse.id,
          );

          this.heartbeatsService.addCwvMetrics({
            id: heartbeat.id,
            ttfb: item.simplifiedResult.timings.TTFB,
            si: item.simplifiedResult.timings.SI,
            cls: item.simplifiedResult.timings.CLS,
            dcl: item.simplifiedResult.timings.DCL,
            fcp: item.simplifiedResult.timings.FCP,
            lcp: item.simplifiedResult.timings.LCP,
            tbt: item.simplifiedResult.timings.TBT,
            tti: item.simplifiedResult.timings.TTI,
          });

          await this.heartbeatsService.addLighthouseScores({
            id: heartbeat.id,
            performance: item.simplifiedResult.performance,
            accessibility: item.simplifiedResult.accessibility,
            bestPractices: item.simplifiedResult.bestPractices,
            seo: item.simplifiedResult.seo,
          });

          /**
           * Update the heartbeat record with the output data.
           */
          await heartbeat.update({
            pulseId: pulse.id,
            status: 4,
          });
        }

        this.logger.log({ pulse, id: playlist.id });
      }
    }
  }
}
