import { Controller, Get, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  kickoff(@Request() req: any) {
    return this.appService.kickoff(req.user);
  }
}
