import { Controller, Get, Param } from '@nestjs/common';
import { HeartbeatsService } from './heartbeats.service';

@Controller('pulses/:uuid')
export class HeartbeatsController {
  constructor(private readonly heartbeatsService: HeartbeatsService) {}

  @Get('mobile')
  getHeartbeatMobile(@Param('uuid') uuid: string) {
    return this.heartbeatsService.getHeartbeatJSON(uuid, true);
  }

  @Get('desktop')
  getHeartbeatDesktop(@Param('uuid') uuid: string) {
    return this.heartbeatsService.getHeartbeatJSON(uuid);
  }
}
