import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

/**
 * Array of allowed topics for the playlist service.
 */
const allowedTopics = JSON.parse(process.env.ALLOWED_TOPICS || '[]');

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
export class AuthorizationGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  /**
   * Determines whether the current request is authorized to proceed.
   *
   * This method first extracts the request object from the provided execution context.
   * It then checks if the request URL is allowlisted and if the `TopicArn` in the request body
   * is included in the `allowedTopics` array. If both conditions are met, the request is authorized.
   * Otherwise, it delegates the authorization check to the parent `canActivate` method.
   *
   * @param context - The execution context containing the request object.
   * @returns `true` if the request is authorized, otherwise the result of the parent `canActivate` method.
   */
  canActivate(context: ExecutionContext) {
    // Check if the handler (or class) has the `isPublic` metadata
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // If `@Public()` is set, skip JWT auth
      return true;
    }

    /**
     * Extract the request object from the context.
     */
    const request = context.switchToHttp().getRequest();

    /**
     * Check if the request URL is allowlisted and the TopicArn
     * is in the allowedTopics array.
     */
    if (
      typeof request.body == 'string' &&
      allowedTopics.includes(JSON.parse(request.body || '{}').TopicArn)
    ) {
      return true;
    }

    /**
     * If the request URL is not allowlisted, call the parent canActivate method.
     */
    return super.canActivate(context);
  }
}
