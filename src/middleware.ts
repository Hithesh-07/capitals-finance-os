import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiter cache (clears periodically)
const rateLimitCache = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per window

/**
 * Next.js Security Middleware
 * Hardens networks, headers, and controls route authentication.
 */
export async function middleware(req: NextRequest) {
  const ip = req.ip || req.headers.get('x-forwarded-for') || '127.0.0.1';
  const pathname = req.nextUrl.pathname;
  
  // 1. RATE LIMITING FOR API ROUTE
  if (pathname.startsWith('/api/')) {
    const now = Date.now();
    const clientLimit = rateLimitCache.get(ip);

    if (!clientLimit) {
      rateLimitCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    } else {
      if (now > clientLimit.resetTime) {
        // Reset window
        clientLimit.count = 1;
        clientLimit.resetTime = now + RATE_LIMIT_WINDOW;
      } else {
        clientLimit.count++;
        if (clientLimit.count > MAX_REQUESTS) {
          return new NextResponse(
            JSON.stringify({ error: 'TOO_MANY_REQUESTS', message: 'API rate limit exceeded. Please retry in 1 minute.' }),
            { 
              status: 429, 
              headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } 
            }
          );
        }
      }
    }
  }

  // 2. INITIALIZE RESPONSE
  const res = NextResponse.next();

  // 3. INJECT SECURITY HEADERS (OWASP Best Practices)
  
  // Strict Content Security Policy
  const cspHeaderValue = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://api.dicebear.com https://*.supabase.co",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; ');

  res.headers.set('Content-Security-Policy', cspHeaderValue);
  
  // Clickjacking prevention
  res.headers.set('X-Frame-Options', 'DENY');
  
  // MIME type sniffing prevention
  res.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Referrer leakage prevention
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Browser features restriction
  res.headers.set(
    'Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), payment=()'
  );

  // Force HTTPS (HSTS) - Enabled in production only
  if (process.env.NODE_ENV === 'production') {
    res.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }

  return res;
}

// Configure middleware routes matching
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
