import { Module } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { TeamsService } from './teams/teams.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthorizationStrategy } from './authorization.strategy';

/**
 * The AuthorizationModule is responsible for handling authorization within the application.
 * It imports the PassportModule with a default strategy of 'jwt' and the JwtModule.
 *
 * @module AuthorizationModule
 *
 * @imports
 * - PassportModule: Registers the passport module with a default JWT strategy.
 * - JwtModule: Registers the JWT module.
 *
 * @providers
 * - AuthorizationStrategy: Provides the strategy for authorization.
 * - UsersService: Service to handle user-related operations.
 * - TeamsService: Service to handle team-related operations.
 *
 * @exports
 * - AuthorizationStrategy: Exports the authorization strategy for use in other modules.
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  providers: [AuthorizationStrategy, UsersService, TeamsService],
  exports: [AuthorizationStrategy],
})
export class AuthorizationModule {}
