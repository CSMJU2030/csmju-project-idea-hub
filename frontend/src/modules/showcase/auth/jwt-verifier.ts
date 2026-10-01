import crypto from 'node:crypto';

export interface CoreHubTokenPayload {
  sub: string;
  email: string;
  role: 'student' | 'alumni' | 'staff' | 'admin';
  sid: string;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
}

export interface VerificationResult {
  isValid: boolean;
  payload?: CoreHubTokenPayload;
  error?: string;
}

interface JwkKey {
  kty: string;
  n: string;
  e: string;
  kid: string;
  use: string;
  alg: string;
}

interface JwksResponse {
  keys: JwkKey[];
}

// In-memory key cache per auth-contract.md §4.1 (TTL 10 min, min refresh 30s)
let cachedKeys: Map<string, crypto.KeyObject> = new Map();
let lastJwksFetchTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000;
const MIN_REFRESH_INTERVAL_MS = 30 * 1000;

const CORE_HUB_URL = process.env.CORE_HUB_URL || 'http://localhost:3000';
const JWKS_ENDPOINT = `${CORE_HUB_URL}/api/v1/.well-known/jwks.json`;

async function fetchAndCacheJwks(force = false): Promise<void> {
  const now = Date.now();
  if (!force && now - lastJwksFetchTime < CACHE_TTL_MS && cachedKeys.size > 0) {
    return;
  }
  if (force && now - lastJwksFetchTime < MIN_REFRESH_INTERVAL_MS) {
    return; // Rate limit key refreshing
  }

  try {
    const res = await fetch(JWKS_ENDPOINT, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch JWKS: HTTP ${res.status}`);
    }

    const jwks: JwksResponse = await res.json();
    const newCache = new Map<string, crypto.KeyObject>();

    for (const key of jwks.keys) {
      if (key.kty === 'RSA' && key.alg === 'RS256') {
        const pubKey = crypto.createPublicKey({ key: key as unknown as crypto.JsonWebKey, format: 'jwk' });
        newCache.set(key.kid, pubKey);
      }
    }

    cachedKeys = newCache;
    lastJwksFetchTime = now;
  } catch (err) {
    console.error('Error fetching Core Hub JWKS:', err);
  }
}

/**
 * Verifies a Core Hub JWT access token according to the 8-step contract in auth-contract.md
 */
export async function verifyCoreHubToken(rawToken: string): Promise<VerificationResult> {
  if (!rawToken || typeof rawToken !== 'string') {
    return { isValid: false, error: 'Token is empty or invalid format' };
  }

  const parts = rawToken.trim().split('.');
  if (parts.length !== 3) {
    return { isValid: false, error: 'Invalid JWT structure' };
  }

  const [headerB64, payloadB64, sigB64] = parts;

  // Step 2 & 3: Decode header, require RS256
  let header: { alg?: string; kid?: string; typ?: string };
  try {
    header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
  } catch {
    return { isValid: false, error: 'Malformed token header' };
  }

  if (header.alg !== 'RS256') {
    return { isValid: false, error: `Unauthorized algorithm: ${header.alg}. Only RS256 is accepted.` };
  }

  if (!header.kid) {
    return { isValid: false, error: 'Missing kid in token header' };
  }

  // Step 4: Find matching public key from JWKS
  await fetchAndCacheJwks(false);
  let publicKey = cachedKeys.get(header.kid);

  if (!publicKey) {
    // Retry once on unknown kid
    await fetchAndCacheJwks(true);
    publicKey = cachedKeys.get(header.kid);
  }

  if (!publicKey) {
    return { isValid: false, error: `Key ID not found in JWKS: ${header.kid}` };
  }

  // Step 5: Verify digital signature (RSA-SHA256)
  try {
    const dataToVerify = Buffer.from(`${headerB64}.${payloadB64}`);
    const signature = Buffer.from(sigB64, 'base64url');
    const isSignatureValid = crypto.verify('RSA-SHA256', dataToVerify, publicKey, signature);

    if (!isSignatureValid) {
      return { isValid: false, error: 'Cryptographic signature mismatch' };
    }
  } catch (sigErr) {
    return { isValid: false, error: `Signature verification failed: ${sigErr}` };
  }

  // Decode Payload
  let payload: CoreHubTokenPayload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    return { isValid: false, error: 'Malformed token payload' };
  }

  // Step 6: Verify iss and aud
  if (payload.iss !== 'core-hub') {
    return { isValid: false, error: `Invalid issuer: ${payload.iss}. Expected 'core-hub'` };
  }

  if (payload.aud !== 'csmju2030') {
    return { isValid: false, error: `Invalid audience: ${payload.aud}. Expected 'csmju2030'` };
  }

  // Step 7: Verify exp with clock skew <= 60s
  const nowUnix = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp + 60 < nowUnix) {
    return { isValid: false, error: 'Token has expired' };
  }

  // Step 8: Ensure sub is present
  if (!payload.sub || typeof payload.sub !== 'string' || payload.sub.trim() === '') {
    return { isValid: false, error: 'Missing or empty sub claim (Global Identity)' };
  }

  return {
    isValid: true,
    payload,
  };
}
