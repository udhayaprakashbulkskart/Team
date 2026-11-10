import { NextResponse, type NextRequest } from 'next/server';

/**
 * Team Portal middleware: CSRF origin check for state-changing API calls, a route gate for /team pages,
 * and a per-request Content-Security-Policy with a nonce.
 */
const SESSION_COOKIE = 'tp_session';

function newNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function buildCsp(nonce: string, isDev: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob:",
    "media-src 'self' blob:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
}

function allowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // non-browser clients still need the session cookie
  const host = req.headers.get('host');
  if (host && (origin === `https://${host}` || origin === `http://${host}`)) return true;
  const app = process.env.NEXT_PUBLIC_APP_URL;
  try {
    return !!app && new URL(origin).origin === new URL(app).origin;
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const nonce = newNonce();
  const csp = buildCsp(nonce, process.env.NODE_ENV !== 'production');
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('content-security-policy', csp);
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/') && !['GET', 'HEAD', 'OPTIONS'].includes(req.method) && !allowedOrigin(req)) {
    const denied = NextResponse.json({ ok: false, error: { code: 'FORBIDDEN', message: 'Cross-site request blocked.' } }, { status: 403 });
    denied.headers.set('Content-Security-Policy', csp);
    return denied;
  }

  if (pathname.startsWith('/team') && !pathname.startsWith('/team/login') && !req.cookies.has(SESSION_COOKIE)) {
    const url = req.nextUrl.clone();
    url.pathname = '/team/login';
    url.search = '';
    const redirect = NextResponse.redirect(url);
    redirect.headers.set('Content-Security-Policy', csp);
    return redirect;
  }

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set('Content-Security-Policy', csp);
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
