import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from './users/users.service';

/**
 * Constructs the JWKS (JSON Web Key Set) URI for a given AWS Cognito user pool.
 *
 * @param region - The AWS region where the Cognito user pool is located.
 * @param poolId - The ID of the Cognito user pool.
 * @returns The JWKS URI for the specified Cognito user pool.
 */
const buildJwksUri = (region: string, poolId: string) =>
  `https://cognito-idp.${region}.amazonaws.com/${poolId}`;

/**
 * @class AuthorizationStrategy
 * @extends PassportStrategy
 *
 * @classdesc
 * This class implements a JWT-based authorization strategy using Passport.js. It extracts the JWT from the Authorization header as a Bearer token and validates it using the JWKS endpoint.
 *
 * @param {ConfigService} configService - The configuration service used to retrieve necessary configuration values.
 * @param {UsersService} usersService - The users service used to update user information.
 *
 * @description
 * The strategy is configured with the following options:
 * - `jwtFromRequest`: Extracts the JWT from the Authorization header as a Bearer token.
 * - `secretOrKeyProvider`: Provides the secret or key using the JWKS endpoint.
 *   - `cache`: Enables caching of the JWKS.
 *   - `rateLimit`: Enables rate limiting of the JWKS requests.
 *   - `jwksRequestsPerMinute`: Limits the number of JWKS requests per minute.
 *   - `jwksUri`: The URI to retrieve the JWKS, constructed using the AWS region and Cognito user pool ID from the configuration service.
 * - `issuer`: The issuer of the JWT, constructed using the AWS region and Cognito user pool ID from the configuration service.
 * - `algorithms`: Specifies the algorithms allowed for JWT validation, in this case, `RS256`.
 *
 * @method constructor
 * @memberof AuthorizationStrategy
 * @param {ConfigService} configService - The configuration service used to retrieve necessary configuration values.
 *
 * @method validate
 * @memberof AuthorizationStrategy
 * @async
 * @param {any} payload - The JWT payload containing user information.
 * @returns {Promise<{ userId: string, username: string }>} An object containing the userId and username extracted from the payload.
 */
@Injectable()
export class AuthorizationStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructs an instance of the authorization strategy.
   *
   * @param configService - The configuration service used to retrieve necessary configuration values.
   * @param usersService - The users service used to update user information.
   *
   * The strategy is configured with the following options:
   * - `jwtFromRequest`: Extracts the JWT from the Authorization header as a Bearer token.
   * - `secretOrKeyProvider`: Provides the secret or key using the JWKS endpoint.
   *   - `cache`: Enables caching of the JWKS.
   *   - `rateLimit`: Enables rate limiting of the JWKS requests.
   *   - `jwksRequestsPerMinute`: Limits the number of JWKS requests per minute.
   *   - `jwksUri`: The URI to retrieve the JWKS, constructed using the AWS region and Cognito user pool ID from the configuration service.
   * - `issuer`: The issuer of the JWT, constructed using the AWS region and Cognito user pool ID from the configuration service.
   * - `algorithms`: Specifies the algorithms allowed for JWT validation, in this case, `RS256`.
   */
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${buildJwksUri(
          configService.get<string>('AWS_REGION'),
          configService.get<string>('COGNITO_USER_POOL_ID'),
        )}/.well-known/jwks.json`,
      }),
      issuer: buildJwksUri(
        configService.get<string>('AWS_REGION'),
        configService.get<string>('COGNITO_USER_POOL_ID'),
      ),
      algorithms: ['RS256'],
    });
  }

  /**
   * Validates the provided payload by updating the user information.
   *
   * @param payload - The payload containing user information to be validated and updated.
   * @returns The updated user information.
   */
  async validate(payload: any) {
    return await this.usersService.updateUser(payload);
  }
}
