import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
  async allTargets(
    @Query('startRow') startRow: number,
    @Query('endRow') endRow: number,
  ) {
    return this.targetsService.allTargets(startRow, endRow);
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
  async pulses(
    @Param('uuid') uuid: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query('startRow') startRow: number,
    @Query('endRow') endRow: number,
  ) {
    /**
     * Fetch the URL record by UUID
     */
    const target = await this.targetsService.targetByUUID(uuid);

    /**
     * Fetch all pulses associated with the target
     */
    return this.pulsesService.pulsesByTarget(
      target.id,
      from,
      to,
      startRow,
      endRow,
    );
  }

  @Get(':uuid/stats')
  async stats(
    @Param('uuid') uuid: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ) {
    /**
     * Fetch the URL record by UUID
     */
    const target = await this.targetsService.targetByUUID(uuid);

    /**
     * Fetch the stats for the target
     */
    const stats = await this.targetsService.targetStats(target.id, from, to);

    return { target, ...stats };
  }

  @Get(':uuid/schedules')
  async schedules(@Param('uuid') uuid: string) {
    return this.schedulesService.schedulesByTarget(uuid);
  }

  @Get(':uuid/urls')
  async urls(@Param('uuid') uuid: string) {
    /**
     * Fetch the URL record by UUID
     */
    const target = await this.targetsService.targetByUUID(uuid);

    return this.urlsService.urlsByTarget(target.id);
  }
}
