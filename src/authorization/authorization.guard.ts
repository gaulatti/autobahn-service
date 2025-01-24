import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

const allowedTopics = JSON.parse(process.env.ALLOWED_TOPICS || '[]');

@Injectable()
export class AuthorizationGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    /**
     * If there's a token, validate it as a normal user.
     */
    if (authHeader) {
      return super.canActivate(context);
    }

    /**
     * If there's no token, check if the route is public.
     */
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    /**
     * If the route is public, allow access.
     */
    if (isPublic) {
      return true;
    }

    /**
     * If the route is not public, check if the request body contains an allowed topic.
     */
    if (
      typeof request.body === 'string' &&
      allowedTopics.includes(JSON.parse(request.body || '{}').TopicArn)
    ) {
      return true;
    }

    /**
     * If the route is not public and the request body does not contain an allowed topic, deny access.
     */
    return false;
  }
}
