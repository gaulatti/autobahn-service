import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { HeartbeatsService } from './heartbeats.service';

@Controller('pulses/:uuid')
export class HeartbeatsController {
  constructor(private readonly heartbeatsService: HeartbeatsService) {}

  @Get('mobile')
  getHeartbeatMobile(@Param('uuid') uuid: string) {
    return this.heartbeatsService.getHeartbeat(uuid, true);
  }

  @Get('desktop')
  getHeartbeatDesktop(@Param('uuid') uuid: string) {
    return this.heartbeatsService.getHeartbeat(uuid);
  }

  @Get('mobile/json')
  getHeartbeatMobileJSON(
    @Param('uuid') uuid: string,
    @Query('minified') minified: boolean = false,
  ) {
    return this.heartbeatsService.getHeartbeatJSON(uuid, true, minified);
  }

  @Get('desktop/json')
  getHeartbeatDesktopJSON(
    @Param('uuid') uuid: string,
    @Query('minified') minified: boolean = false,
  ) {
    return this.heartbeatsService.getHeartbeatJSON(uuid, false, minified);
  }

  @Patch('mobile/retry')
  retryHeartbeatMobile(@Param('uuid') uuid: string) {
    return this.heartbeatsService.retryHeartbeat(uuid, true);
  }

  @Patch('desktop/retry')
  retryHeartbeatDesktop(@Param('uuid') uuid: string) {
    return this.heartbeatsService.retryHeartbeat(uuid, true);
  }
}
