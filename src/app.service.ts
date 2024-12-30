import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Membership } from './models/membership.model';
import { Team } from './models/team.model';
import { User } from './models/user.model';
import { ENUMS } from './consts';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User)
    private readonly user: typeof User,
  ) {}

  async kickoff(user: { sub: string }) {
    const me = await this.user.findOne({
      where: { sub: user.sub },
      include: [{ model: Membership, include: [{ model: Team }] }],
    });
    return {
      me,
      features: [],
      enums: ENUMS,
    };
  }
}
