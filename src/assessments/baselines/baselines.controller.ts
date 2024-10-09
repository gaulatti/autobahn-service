import { Body, Controller, Param, Patch } from '@nestjs/common';
import { BaselinesService } from './baselines.service';
import { BaselinesDto } from './baselines.dto';

@Controller('targets/:uuid/baselines')
export class BaselinesController {
  constructor(private readonly baselinesService: BaselinesService) {}

  @Patch()
  async updateBaseline(@Param('uuid') uuid: string, @Body() dto: BaselinesDto) {
    return this.baselinesService.updateBaseline(uuid, dto);
  }
}
