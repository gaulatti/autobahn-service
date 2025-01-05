import { Controller, Get, Param } from '@nestjs/common';
import { Logger } from 'src/logger/logger.decorator';
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
  async getStrategies() {
    return this.strategiesService.getStrategies();
  }

  @Get(':slug')
  getStrategy(@Param('slug') slug: string) {
    return this.strategiesService.getStrategy(slug);
  }
}
