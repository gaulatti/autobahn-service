import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { ENUMS } from './consts';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User)
    private readonly user: typeof User,
  ) {}

  async kickoff(user: { userId: string }) {
    const me = await this.user.findOne({ where: { sub: user.userId } });
    return { enums: ENUMS, me, features: [] };
  }
}
