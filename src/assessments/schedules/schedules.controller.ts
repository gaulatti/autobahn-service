import { Controller, Get, Param } from '@nestjs/common';
import { SchedulesService } from './schedules.service';

@Controller('projects/:uuid/schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  async allSchedules(@Param('uuid') uuid: string) {
    return this.schedulesService.allSchedules(uuid);
  }
}
