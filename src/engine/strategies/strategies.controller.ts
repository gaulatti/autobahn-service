import { Controller, Get, Param, Query } from '@nestjs/common';
import { Logger } from 'src/decorators/logger.decorator';
import { JSONLogger } from 'src/utils/logger';
import { StrategiesService } from './strategies.service';

@Controller('strategies')
export class StrategiesController {
  constructor(private readonly strategiesService: StrategiesService) {}

  /**
   * Logger instance for logging messages.
   */
  @Logger(StrategiesController.name)
  private readonly logger!: JSONLogger;

  @Get()
  async getStrategies(
    @Query('sort') sort: string,
    @Query('startRow') startRow: number,
    @Query('endRow') endRow: number,
  ) {
    return this.strategiesService.getStrategies(sort, startRow, endRow);
  }

  @Get(':slug')
  getStrategy(@Param('slug') slug: string) {
    return this.strategiesService.getStrategy(slug);
  }
}
