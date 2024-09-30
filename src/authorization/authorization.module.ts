import { Module } from '@nestjs/common';
import { JwtService } from './jwt/jwt.service';
import { UsersService } from './users/users.service';
import { TeamsService } from './teams/teams.service';

@Module({
  providers: [JwtService, UsersService, TeamsService]
})
export class AuthorizationModule {}
