import crypto from 'crypto';

const SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me';
const COOKIE_NAME = 'crestovia_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function sign(value) {
  const h = crypto.createHmac('sha256', SECRET).update(value).digest('hex');
  return `${value}.${h}`;
}

function verify(token) {
  if (!token) return false;
  const idx = token.lastIndexOf('.');
  if (idx === -1) return false;
  const value = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = crypto.createHmac('sha256', SECRET).update(value).digest('hex');
  if (sig.length !== expected.length) return false;
  const ok = crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  if (!ok) return false;
  const parts = value.split(':');
  const ts = Number(parts[1]);
  if (!ts || Date.now() - ts > MAX_AGE_SECONDS * 1000) return false;
  return true;
}

export function createSessionCookie() {
  const value = `admin:${Date.now()}`;
  const token = sign(value);
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function clearSessionCookie() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

export function isAuthed(req) {
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(COOKIE_NAME + '='));
  if (!match) return false;
  const token = match.slice(COOKIE_NAME.length + 1);
  return verify(token);
}
