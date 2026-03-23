import { auth } from "./auth";
import { NextResponse } from "next/server";

const API_SECRET = process.env.API_SECRET;

const PUBLIC_PATHS = ["/", "/login", "/api/auth"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // API routes: check API key (except /api/auth which is NextAuth)
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    if (!API_SECRET) {
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );
    }
    const token =
      req.headers.get("x-api-key") ??
      req.nextUrl.searchParams.get("key");
    if (token !== API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Public paths: allow through
  if (
    PUBLIC_PATHS.some(
      (p) => pathname === p || pathname.startsWith("/api/auth")
    )
  ) {
    return NextResponse.next();
  }

  // Protected paths: require auth
  if (!req.auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|.*\\.svg$).*)",
  ],
};
