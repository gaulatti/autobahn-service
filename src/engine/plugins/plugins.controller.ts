import { Controller, Get, Param, Query } from '@nestjs/common';
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
  async getPlugins(
    @Query('sort') sort: string,
    @Query('startRow') startRow: number,
    @Query('endRow') endRow: number,
  ) {
    return this.pluginsService.getPlugins(sort, startRow, endRow);
  }

  @Get(':slug')
  getPlugin(@Param('slug') slug: string) {
    return this.pluginsService.getPlugin(slug);
  }
}
