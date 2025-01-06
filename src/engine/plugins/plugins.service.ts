import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from 'src/logger/logger.decorator';
import { Playlist } from 'src/models/playlist.model';
import { Plugin } from 'src/models/plugin.model';
import { Slot } from 'src/models/slot.model';
import { getPaginationParams, getSortParams } from 'src/utils/lists';
import { JSONLogger } from 'src/utils/logger';
import { PlaylistsService } from '../playlists/playlists.service';

/**
 * An instance of the AWS Lambda client.
 * This client is used to interact with AWS Lambda services.
 */
const lambdaClient = new LambdaClient();

/**
 * Service responsible for processing plugins in a playlist sequence.
 */
@Injectable()
export class PluginsService {
  constructor(
    @InjectModel(Plugin) private readonly plugin: typeof Plugin,
    @Inject(forwardRef(() => PlaylistsService))
    private readonly playlistsService: PlaylistsService,
  ) {}

  /**
   * Logger instance for logging messages.
   */
  @Logger(PluginsService.name)
  private readonly logger!: JSONLogger;

  /**
   * Retrieves all playlists.
   *
   * @returns {Promise<Plugin[]>} A promise that resolves to an array of playlists.
   */
  async getPlugins(
    sort: string,
    startRow?: number,
    endRow?: number,
  ): Promise<{ rows: Plugin[]; count: number }> {
    const paginationParams = getPaginationParams(startRow, endRow);

    return this.plugin.findAndCountAll({
      ...paginationParams,
      order: getSortParams(sort),
      distinct: true,
    });
  }

  /**
   * Retrieves a plugin by its slug.
   *
   * @param slug - The unique identifier for the plugin.
   * @returns A promise that resolves to the plugin object if found, or null if not found.
   */
  async getPlugin(slug: string) {
    return this.plugin.findOne({ where: { slug } });
  }

  /**
   * Processes the next plugin in the playlist sequence.
   *
   * @param playlist - The playlist object containing the sequence of plugins to be executed.
   *
   * This method performs the following steps:
   * 1. Retrieves the next plugin from the playlist sequence.
   * 2. Updates the playlist manifest by adding the current plugin to the executed slots.
   * 3. If the current plugin is a NoOp plugin, it updates the playlist context with the plugin's metadata.
   * 4. Updates the playlist with the new sequence and executed slots.
   * 5. Saves the updated playlist.
   * 6. If the current plugin is not a NoOp plugin, it executes the plugin.
   * 7. If the current plugin is a NoOp plugin, it continues with the next plugin in the sequence.
   */
  async next(playlist: Playlist) {
    /**
     * Get the plugin from the sequence.
     */
    const current = playlist.manifest.sequence.shift();
    const manifest = { ...playlist.manifest };
    playlist.manifest.executed_slots.push(current);

    /**
     * If the plugin is a NoOp plugin, we can skip the execution and
     * update the playlist context with the metadata.
     */
    if (current && current.plugin.arn.includes('NoOp')) {
      manifest.context = {
        ...manifest.context,
        ...current.metadata,
      };
    }

    /**
     * Update the playlist with the new sequence and executed slots.
     */
    playlist.set('nextStep', current.plugin.arn);
    playlist.set('manifest', manifest);
    playlist.changed('manifest', true);
    await playlist.save();

    /**
     * If the plugin is not a NoOp plugin, we execute the plugin.
     * Otherwise, we continue with the next plugin in the sequence.
     */
    if (current && !current.plugin.arn.includes('NoOp')) {
      await this.run(current, playlist);
    } else {
      await this.playlistsService.continue(playlist);
    }
  }

  /**
   * Executes a specified plugin by invoking an AWS Lambda function.
   *
   * @param current - The current slot containing the plugin information.
   * @param playlist - The playlist data to be passed as payload to the Lambda function.
   * @returns A promise that resolves when the Lambda function invocation is complete.
   *
   * @throws Will throw an error if the Lambda function invocation fails.
   */
  private async run(current: Slot, playlist: Playlist) {
    const params = {
      FunctionName: current.plugin.arn,
      Payload: JSON.stringify({ playlist }),
    };

    try {
      const command = new InvokeCommand(params);
      await lambdaClient.send(command);
    } catch (error) {
      this.logger.error('Error invoking lambda:', error);
    }
  }

  /**
   * Retrieves a plugin by its key.
   *
   * @param key - The key of the plugin to retrieve.
   * @returns The plugin object with the specified key.
   */
  getPluginByKey(key: string) {
    return this.plugin.findOne({ where: { pluginKey: key } });
  }
}
