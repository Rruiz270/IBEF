import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Use edge-compatible config for middleware (no DB/bcrypt)
const { auth } = NextAuth(authConfig);

const API_SECRET = process.env.API_SECRET;
const PUBLIC_PATHS = ["/", "/login"];

export default auth((req: NextRequest & { auth: unknown }) => {
  const { pathname } = req.nextUrl;

  // Always allow NextAuth internal routes
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

  // Public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected: require session
  if (!(req as { auth: unknown }).auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.ico$).*)",
  ],
};
