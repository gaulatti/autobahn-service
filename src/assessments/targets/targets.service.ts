import { Injectable } from '@nestjs/common';
import { TargetsDto } from './targets.dto';

@Injectable()
export class TargetsService {
  deleteTarget(uuid: string) {
    throw new Error('Method not implemented.');
  }
  updateTarget(uuid: string, dto: TargetsDto) {
    throw new Error('Method not implemented.');
  }
  createTarget(dto: TargetsDto) {
    throw new Error('Method not implemented.');
  }
  allTargets() {
    throw new Error('Method not implemented.');
  }
  getTarget(uuid: string) {
    throw new Error('Method not implemented.');
  }
  targetsByUrl(uuid: string) {
    throw new Error('Method not implemented.');
  }
}
