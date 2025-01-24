import { Controller, Get, Param, Query } from '@nestjs/common';
import { PulsesService } from '../pulses/pulses.service';
import { TargetsService } from '../targets/targets.service';
import { UrlsService } from './urls.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('urls')
export class UrlsController {
  constructor(
    private readonly urlsService: UrlsService,
    private readonly targetsService: TargetsService,
    private readonly pulsesService: PulsesService,
  ) {}

  @Get()
  @Public()
  async allUrls(
    @Query('startRow') startRow: number,
    @Query('endRow') endRow: number,
  ) {
    return this.urlsService.allUrls(startRow, endRow);
  }

  @Get(':slug/stats')
  @Public()
  async stats(
    @Param('slug') slug: string,
    @Query('sort') sort: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ) {
    /**
     * Fetch the URL record by Slug
     */
    const url = await this.urlsService.urlBySlug(slug);

    /**
     * Fetch the stats for the target
     */
    const stats = await this.urlsService.urlStats(url.id, sort, from, to);

    return { url, ...stats };
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
    const url = await this.urlsService.urlBySlug(slug);
    return this.pulsesService.pulsesByUrl(
      url.id,
      sort,
      from,
      to,
      startRow,
      endRow,
    );
  }

  @Get(':slug/targets')
  @Public()
  async targets(@Param('slug') slug: string) {
    return this.targetsService.targetsByUrl(slug);
  }
}
