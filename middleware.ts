import { NextRequest, NextResponse } from 'next/server';

const API_SECRET = process.env.API_SECRET;

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/')) {
    if (!API_SECRET) {
      console.error('[middleware] API_SECRET env var is not set — blocking all API requests');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const token =
      req.headers.get('x-api-key') ??
      req.nextUrl.searchParams.get('key');

    if (token !== API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
