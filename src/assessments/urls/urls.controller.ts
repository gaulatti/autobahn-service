import { Controller, Get } from '@nestjs/common';
import { UrlsService } from './urls.service';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get()
  async allUrls() {
    return this.urlsService.allUrls();
  }
}
