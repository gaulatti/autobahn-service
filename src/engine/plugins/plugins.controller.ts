import { Controller, Get, Param } from '@nestjs/common';
import { Logger } from 'src/logger/logger.decorator';
import { JSONLogger } from 'src/utils/logger';
import { PluginsService } from './plugins.service';

@Controller('plugins')
export class PluginsController {
  constructor(private readonly pluginsService: PluginsService) {}

  /**
   * Logger instance for logging messages.
   */
  @Logger(PluginsController.name)
  private readonly logger!: JSONLogger;

  @Get()
  async getPlugins() {
    return this.pluginsService.getPlugins();
  }

  @Get(':slug')
  getPlugin(@Param('slug') slug: string) {
    return this.pluginsService.getPlugin(slug);
  }
}
