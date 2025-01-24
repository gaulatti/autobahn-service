import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ENUMS } from './consts';
import { Membership } from './models/membership.model';
import { Team } from './models/team.model';
import { User } from './models/user.model';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User)
    private readonly user: typeof User,
  ) {}

  async kickoff(user: { sub: string }) {
    const me =
      user?.sub &&
      (await this.user.findOne({
        where: { sub: user.sub },
        include: [{ model: Membership, include: [{ model: Team }] }],
      }));

    return {
      me,
      features: [],
      enums: ENUMS,
    };
  }
}
