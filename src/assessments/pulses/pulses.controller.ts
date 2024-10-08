import { Controller, Get, Param } from '@nestjs/common';
import { PulsesService } from './pulses.service';

@Controller('pulses')
export class PulsesController {
  constructor(private readonly pulsesService: PulsesService) {}
  @Get()
  getPulses() {
    return this.pulsesService.allPulses();
  }

  @Get(':uuid')
  getPulse(@Param('uuid') uuid: string) {
    return this.pulsesService.getPulse(uuid);
  }

  @Get(':uuid/mobile')
  getHeartbeatMobile(@Param('uuid') uuid: string) {
    return this.pulsesService.getHeartbeat(uuid, true);
  }

  @Get(':uuid/desktop')
  getHeartbeatDesktop(@Param('uuid') uuid: string) {
    return this.pulsesService.getHeartbeat(uuid);
  }
}
