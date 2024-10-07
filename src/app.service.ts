import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Team } from './models/team.model';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Team)
    private readonly team: typeof Team,
  ) {}

  async getUsers() {
    const response = await this.team.findAll();
    return response;
  }
}
