import { Controller, Get } from '@nestjs/common';
import { PulsesService } from './pulses.service';

@Controller('pulses')
export class PulsesController {
  constructor(private readonly pulsesService: PulsesService) {}
  @Get()
  getPulses() {
    return this.pulsesService.allPulses();
  }
}
