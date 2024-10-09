import { Controller, Get, Param, Query } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { TargetsService } from '../targets/targets.service';
import { PulsesService } from '../pulses/pulses.service';

@Controller('urls')
export class UrlsController {
  constructor(
    private readonly urlsService: UrlsService,
    private readonly targetsService: TargetsService,
    private readonly pulsesService: PulsesService,
  ) {}

  @Get()
  async allUrls() {
    return this.urlsService.allUrls();
  }

  @Get(':uuid/stats')
  async stats(
    @Param('uuid') uuid: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ) {
    return this.urlsService.urlStats(uuid, from, to);
  }

  @Get(':uuid/pulses')
  async pulses(
    @Param('uuid') uuid: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query('startRow') startRow: number,
    @Query('endRow') endRow: number,
    @Query('sort') sort: string,
    @Query('filters') filters: string,
  ) {
    const url = await this.urlsService.urlByUUID(uuid);
    return this.pulsesService.pulsesByUrl(url.id, from, to, startRow, endRow);
  }

  @Get(':uuid/targets')
  async targets(@Param('uuid') uuid: string) {
    return this.targetsService.targetsByUrl(uuid);
  }
}
