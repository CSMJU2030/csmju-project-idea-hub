import { NextRequest, NextResponse } from 'next/server';
import { verifyCoreHubToken } from '../../../modules/showcase/auth/jwt-verifier';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const accessToken = searchParams.get('access_token');
  const expiresInParam = searchParams.get('expires_in');
  const state = searchParams.get('state');

  if (!accessToken) {
    return NextResponse.json(
      {
        success: false,
        error: { statusCode: 400, message: 'Missing access_token in SSO callback' },
      },
      { status: 400 },
    );
  }

  // Verify token via 8-step JWKS verification
  const verification = await verifyCoreHubToken(accessToken);
  if (!verification.isValid || !verification.payload) {
    return NextResponse.json(
      {
        success: false,
        error: {
          statusCode: 401,
          message: verification.error || 'Invalid Core Hub token',
        },
      },
      { status: 401 },
    );
  }

  // Calculate maxAge
  const nowUnix = Math.floor(Date.now() / 1000);
  const maxAge = expiresInParam
    ? parseInt(expiresInParam, 10)
    : Math.max(0, verification.payload.exp - nowUnix);

  // Validate redirect target to prevent open redirect
  let redirectTarget = '/showcase';
  if (state && state.startsWith('/') && !state.startsWith('//')) {
    redirectTarget = state;
  }

  const response = NextResponse.redirect(new URL(redirectTarget, request.url));

  // Set HTTP-only session cookie per auth-contract.md §5.1
  response.cookies.set('core_hub_access_token', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: maxAge > 0 ? maxAge : 900,
  });

  return response;
}
