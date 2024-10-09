import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesDto } from './schedules.dto';

@Controller('projects/:uuid/schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  async allSchedules(@Param('uuid') uuid: string) {
    return this.schedulesService.allSchedules(uuid);
  }

  @Post()
  async createSchedule(@Param('uuid') uuid: string, @Body() dto: SchedulesDto) {
    return this.schedulesService.createSchedule(uuid, dto);
  }

  @Get(':scheduleUuid')
  async getSchedule(
    @Param('uuid') uuid: string,
    @Param('scheduleUuid') scheduleUuid: string,
  ) {
    return this.schedulesService.getSchedule(scheduleUuid);
  }

  @Patch(':scheduleUuid')
  async updateSchedule(
    @Param('scheduleUuid') scheduleUuid: string,
    @Body() dto: SchedulesDto,
  ) {
    return this.schedulesService.updateSchedule(scheduleUuid, dto);
  }

  @Delete(':scheduleUuid')
  async deleteSchedule(
    @Param('uuid') uuid: string,
    @Param('scheduleUuid') scheduleUuid: string,
  ) {
    return this.schedulesService.deleteSchedule(scheduleUuid);
  }
}
