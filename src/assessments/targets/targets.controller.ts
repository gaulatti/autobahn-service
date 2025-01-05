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
import { UrlsService } from '../urls/urls.service';
import { TargetsDto } from './targets.dto';
import { TargetsService } from './targets.service';

@Controller('targets')
export class TargetsController {
  constructor(
    private readonly targetsService: TargetsService,
    private readonly pulsesService: PulsesService,
    private readonly urlsService: UrlsService,
  ) {}

  @Get()
  async allTargets(
    @Query('sort') sort: string,
    @Query('startRow') startRow: number,
    @Query('endRow') endRow: number,
  ) {
    return this.targetsService.allTargets(sort, startRow, endRow);
  }

  @Post()
  async createTarget(@Body() dto: TargetsDto) {
    return this.targetsService.createTarget(dto);
  }

  @Get(':slug')
  async getTarget(@Param('slug') slug: string) {
    return this.targetsService.getTarget(slug);
  }

  @Patch(':slug')
  async updateTarget(@Param('slug') slug: string, @Body() dto: TargetsDto) {
    return this.targetsService.updateTarget(slug, dto);
  }

  @Delete(':slug')
  async deleteTarget(@Param('slug') slug: string) {
    return this.targetsService.deleteTarget(slug);
  }

  @Get(':slug/pulses')
  async pulses(
    @Param('slug') slug: string,
    @Query('sort') sort: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query('startRow') startRow: number,
    @Query('endRow') endRow: number,
  ) {
    /**
     * Fetch the URL record by Slug
     */
    const target = await this.targetsService.targetBySlug(slug);

    /**
     * Fetch all pulses associated with the target
     */
    return this.pulsesService.pulsesByTarget(
      target.id,
      sort,
      from,
      to,
      startRow,
      endRow,
    );
  }

  @Get(':slug/stats')
  async stats(
    @Param('slug') slug: string,
    @Query('sort') sort: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ) {
    /**
     * Fetch the URL record by Slug
     */
    const target = await this.targetsService.targetBySlug(slug);

    /**
     * Fetch the stats for the target
     */
    const stats = await this.targetsService.targetStats(
      target.id,
      sort,
      from,
      to,
    );

    return { target, ...stats };
  }

  @Get(':slug/urls')
  async urls(@Param('slug') slug: string) {
    /**
     * Fetch the URL record by Slug
     */
    const target = await this.targetsService.targetBySlug(slug);

    return this.urlsService.urlsByTarget(target.id);
  }
}
