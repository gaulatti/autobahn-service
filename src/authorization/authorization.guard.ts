import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that uses JWT strategy for authorization.
 *
 * This guard extends the `AuthGuard` class provided by the `@nestjs/passport` package,
 * and it is configured to use the 'jwt' strategy. It ensures that the incoming request
 * is authenticated using a JSON Web Token (JWT).
 *
 * @extends AuthGuard('jwt')
 */
@Injectable()
export class AuthorizationGuard extends AuthGuard('jwt') {}
