import type { CookieSerializeOptions } from '@fastify/cookie';

export const REFRESH_COOKIE_NAME = '__rp_refresh';
export const SID_COOKIE_NAME = '__rp_sid';
export const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

export function buildAuthCookieOptions(isProduction: boolean): CookieSerializeOptions {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/auth',
    signed: true,
    maxAge: COOKIE_MAX_AGE,
  };
}
