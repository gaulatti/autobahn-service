import { Controller, Get, Param, Query } from '@nestjs/common';
import { PulsesService } from './pulses.service';

@Controller('pulses')
export class PulsesController {
  constructor(private readonly pulsesService: PulsesService) {}
  @Get()
  getPulses(
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query('startRow') startRow: number,
    @Query('endRow') endRow: number,
  ) {
    return this.pulsesService.allPulses(from, to, startRow, endRow);
  }

  @Get(':uuid')
  getPulse(@Param('uuid') uuid: string) {
    return this.pulsesService.getPulse(uuid);
  }
}
