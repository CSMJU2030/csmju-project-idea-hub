import { Controller, Get, Headers, Query, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import type { Request, Response } from 'express';

import { AppException } from '../common/errors';
import { AuthEventsLogger } from './auth-events.logger';
import { TokenRejectionReason, TokenVerificationError } from './auth.errors';
import { CoreHubTokenVerifier } from './core-hub-token.verifier';
import { Public } from './decorators/public.decorator';
import { SsoCallbackQueryDto } from './dto/sso-callback.dto';
import { mapCoreRoleToSubsystemRole } from './role-mapping';
import {
  SSO_STATE_COOKIE_NAME,
  buildSsoCookie,
  buildStateCookie,
  clearStateCookie,
  readCookie,
} from './sso-session';

/**
 * Central SSO controller - handles:
 *  - `GET /auth/login` (initiates SSO with random state cookie, 302 to Core Hub)
 *  - `GET /auth/callback` (verifies state, token, maps role, sets session cookie)
 */
@Controller('auth')
export class SsoCallbackController {
  constructor(
    private readonly verifier: CoreHubTokenVerifier,
    private readonly authEvents: AuthEventsLogger,
    private readonly config: ConfigService,
  ) {}

  @Public()
  @Get('login')
  async login(
    @Res() response: Response,
    @Query('return_to') _returnTo?: string,
  ) {
    const state = randomUUID();
    const isProd = this.config.get<string>('nodeEnv') === 'production';
    const coreHubUrl = (this.config.get<string>('coreHub.url') ?? 'http://localhost:3000').replace(/\/+$/, '');
    const subsystemId = this.config.get<string>('subsystemId', 'csmju-project-idea-hub');

    response.setHeader('Set-Cookie', buildStateCookie(state, 300, isProd));

    const authUrl = new URL(`${coreHubUrl}/api/v1/auth/sso/authorize`);
    authUrl.searchParams.set('subsystem', subsystemId);
    authUrl.searchParams.set('state', state);

    response.redirect(302, authUrl.toString());
  }

  @Public()
  @Get('callback')
  async callback(
    @Query() query: SsoCallbackQueryDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Headers('accept') accept?: string,
  ) {
    response.setHeader('Referrer-Policy', 'no-referrer');
    const isProd = this.config.get<string>('nodeEnv') === 'production';

    // State verification against cookie (auth-contract §5)
    const cookieHeader = request.header('cookie');
    const stateCookie = readCookie(cookieHeader, SSO_STATE_COOKIE_NAME);
    const isBrowser = accept?.includes('text/html');

    if (isBrowser && stateCookie) {
      if (!query.state || query.state !== stateCookie) {
        this.authEvents.jwtRejected({
          reason: TokenRejectionReason.MALFORMED_TOKEN,
          path: '/auth/callback',
        });
        response.setHeader('Set-Cookie', clearStateCookie(isProd));
        response.redirect(302, '/auth/login');
        return;
      }
    }

    let payload;
    try {
      payload = await this.verifier.verify(query.access_token);
    } catch (error) {
      const reason =
        error instanceof TokenVerificationError
          ? error.reason
          : TokenRejectionReason.MALFORMED_TOKEN;
      const kid = error instanceof TokenVerificationError ? error.kid : undefined;

      this.authEvents.jwtRejected({ reason, kid, path: '/auth/callback' });

      throw AppException.unauthorized(
        'The Core Hub SSO token could not be verified',
      );
    }

    const subsystemRole = mapCoreRoleToSubsystemRole(payload.role);

    if (!subsystemRole) {
      this.authEvents.roleMappingFailed({ sub: payload.sub, coreRole: payload.role });

      throw AppException.forbidden(
        'Your Core Hub role has no access to this subsystem',
      );
    }

    const expiresInSec = this.remainingLifetimeSec(payload.exp);

    const cookiesToSet = [
      buildSsoCookie(query.access_token, expiresInSec, isProd),
      clearStateCookie(isProd),
    ];
    response.setHeader('Set-Cookie', cookiesToSet);

    this.authEvents.jwtVerified({
      sub: payload.sub,
      coreRole: payload.role,
      subsystemRole,
    });

    if (isBrowser) {
      response.redirect(302, '/showcase');
      return;
    }

    return {
      id: payload.sub,
      email: payload.email ?? '',
      coreRole: payload.role,
      subsystemRole,
      session: {
        source: 'core-hub-sso',
        expiresIn: expiresInSec,
      },
      ...(query.state !== undefined && { state: query.state }),
    };
  }

  private remainingLifetimeSec(exp: number | undefined): number {
    if (typeof exp !== 'number') {
      return 0;
    }

    return Math.max(0, exp - Math.floor(Date.now() / 1000));
  }
}
