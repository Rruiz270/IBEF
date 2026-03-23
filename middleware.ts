import { NextRequest, NextResponse } from "next/server";

const API_SECRET = process.env.API_SECRET;

// Routes that don't need protection
const PUBLIC_PATHS = ["/", "/login", "/api/auth"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow NextAuth routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // API routes: check API key
  if (pathname.startsWith("/api/")) {
    if (!API_SECRET) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }
    const token =
      req.headers.get("x-api-key") ??
      req.nextUrl.searchParams.get("key");
    if (token !== API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Public paths — allow through
  if (pathname === "/" || pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // For protected routes: check for session token cookie
  const sessionToken =
    req.cookies.get("next-auth.session-token") ??
    req.cookies.get("__Secure-next-auth.session-token");

  if (!sessionToken) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.ico$).*)",
  ],
};
