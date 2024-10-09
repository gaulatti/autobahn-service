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
  async allUrls(
    @Query('startRow') startRow: number,
    @Query('endRow') endRow: number,
  ) {
    return this.urlsService.allUrls(startRow, endRow);
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
    const url = await this.urlsService.urlByUUID(uuid);

    /**
     * Fetch the stats for the target
     */
    const stats = await this.urlsService.urlStats(url.id, from, to);

    return { url, ...stats };
  }

  @Get(':uuid/pulses')
  async pulses(
    @Param('uuid') uuid: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query('startRow') startRow: number,
    @Query('endRow') endRow: number,
  ) {
    const url = await this.urlsService.urlByUUID(uuid);
    return this.pulsesService.pulsesByUrl(url.id, from, to, startRow, endRow);
  }

  @Get(':uuid/targets')
  async targets(@Param('uuid') uuid: string) {
    return this.targetsService.targetsByUrl(uuid);
  }
}
