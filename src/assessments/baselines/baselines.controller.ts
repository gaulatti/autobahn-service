import { Body, Controller, Param, Patch } from '@nestjs/common';
import { BaselinesDto } from './baselines.dto';
import { BaselinesService } from './baselines.service';

@Controller('targets/:slug/baselines')
export class BaselinesController {
  constructor(private readonly baselinesService: BaselinesService) {}

  /**
   * Updates a baseline with the given slug and data transfer object (DTO).
   *
   * @param slug - The unique identifier of the baseline to update.
   * @param dto - The data transfer object containing the updated baseline information.
   * @returns A promise that resolves to the updated baseline.
   */
  @Patch()
  async updateBaseline(@Param('slug') slug: string, @Body() dto: BaselinesDto) {
    return this.baselinesService.updateBaseline(slug, dto);
  }
}
