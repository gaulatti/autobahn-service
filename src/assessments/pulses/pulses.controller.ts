import { Controller, Get } from '@nestjs/common';

@Controller('pulses')
export class PulsesController {
  @Get()
  getPulses() {
    return 'lala';
    // return this.appService.kickoff(req.user);
  }
}
