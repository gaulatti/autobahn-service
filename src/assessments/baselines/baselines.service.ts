import { Injectable } from '@nestjs/common';
import { BaselinesDto } from './baselines.dto';

@Injectable()
export class BaselinesService {
  updateBaseline(uuid: string, dto: BaselinesDto) {
    throw new Error('Method not implemented.');
  }
}
