import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PulsesService } from '../pulses/pulses.service';
import { SchedulesService } from '../schedules/schedules.service';
import { UrlsService } from '../urls/urls.service';
import { TargetsService } from './targets.service';
import { TargetsDto } from './targets.dto';

@Controller('targets')
export class TargetsController {
  constructor(
    private readonly targetsService: TargetsService,
    private readonly pulsesService: PulsesService,
    private readonly urlsService: UrlsService,
    private readonly schedulesService: SchedulesService,
  ) {}

  @Get()
  async allTargets() {
    return this.targetsService.allTargets();
  }

  @Post()
  async createTarget(@Body() dto: TargetsDto) {
    return this.targetsService.createTarget(dto);
  }

  @Get(':uuid')
  async getTarget(@Param('uuid') uuid: string) {
    return this.targetsService.getTarget(uuid);
  }

  @Patch(':uuid')
  async updateTarget(@Param('uuid') uuid: string, @Body() dto: TargetsDto) {
    return this.targetsService.updateTarget(uuid, dto);
  }

  @Delete(':uuid')
  async deleteTarget(@Param('uuid') uuid: string) {
    return this.targetsService.deleteTarget(uuid);
  }

  @Get(':uuid/pulses')
  async pulses(@Param('uuid') uuid: string) {
    return this.pulsesService.pulsesByTarget(uuid);
  }

  @Get(':uuid/schedules')
  async schedules(@Param('uuid') uuid: string) {
    return this.schedulesService.schedulesByTarget(uuid);
  }

  @Get(':uuid/urls')
  async urls(@Param('uuid') uuid: string) {
    return this.urlsService.urlsByTarget(uuid);
  }
}
