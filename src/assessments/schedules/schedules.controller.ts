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

@Controller('projects/:slug/schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  async allSchedules(@Param('slug') slug: string) {
    return this.schedulesService.allSchedules(slug);
  }

  @Post()
  async createSchedule(@Param('slug') slug: string, @Body() dto: SchedulesDto) {
    return this.schedulesService.createSchedule(slug, dto);
  }

  @Get(':scheduleSlug')
  async getSchedule(
    @Param('slug') slug: string,
    @Param('scheduleSlug') scheduleSlug: string,
  ) {
    return this.schedulesService.getSchedule(scheduleSlug);
  }

  @Patch(':scheduleSlug')
  async updateSchedule(
    @Param('scheduleSlug') scheduleSlug: string,
    @Body() dto: SchedulesDto,
  ) {
    return this.schedulesService.updateSchedule(scheduleSlug, dto);
  }

  @Delete(':scheduleSlug')
  async deleteSchedule(
    @Param('slug') slug: string,
    @Param('scheduleSlug') scheduleSlug: string,
  ) {
    return this.schedulesService.deleteSchedule(scheduleSlug);
  }
}
