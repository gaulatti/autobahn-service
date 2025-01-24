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
import { Public } from 'src/decorators/public.decorator';

@Controller('targets')
export class TargetsController {
  constructor(
    private readonly targetsService: TargetsService,
    private readonly pulsesService: PulsesService,
    private readonly urlsService: UrlsService,
  ) {}

  @Get()
  @Public()
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
  @Public()
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
  @Public()
  async pulses(
    @Param('slug') slug: string,
    @Query('sort') sort: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query('startRow') startRow: number,
    @Query('endRow') endRow: number,
  ) {
    /**
     * Fetch all pulses associated with the target
     */
    return this.pulsesService.pulsesByTarget(
      slug,
      sort,
      from,
      to,
      startRow,
      endRow,
    );
  }

  @Get(':slug/stats')
  @Public()
  async stats(
    @Param('slug') slug: string,
    @Query('sort') sort: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ) {
    return this.targetsService.targetStats(slug, sort, from, to);
  }

  @Get(':slug/urls')
  @Public()
  async urls(@Param('slug') slug: string) {
    /**
     * Fetch the URL record by Slug
     */
    const target = await this.targetsService.targetBySlug(slug);

    return this.urlsService.urlsByTarget(target.id);
  }
}
