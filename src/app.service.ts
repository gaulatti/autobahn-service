import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  kickoff() {
    return {
      me: {
        memberships: [],
      },
      features: [],
      enums: [],
    };
  }
}
