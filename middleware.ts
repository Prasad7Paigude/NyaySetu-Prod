// middleware.ts
// Place this file in the ROOT of your project (same level as package.json)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Routes that require authentication
const protectedRoutes = ["/dashboard"];

// Routes for authentication (login/signup)
const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Use Better Auth's getSessionCookie helper
  // This checks for the "better-auth.session_token" cookie
  const sessionCookie = getSessionCookie(request, {
  cookieName: "session",
  cookiePrefix: "better-auth",
});

  // Fallback: also check manually in case getSessionCookie has issues
  const manualCookie = request.cookies.get("better-auth.session")?.value;
  
  const isAuthenticated = !!(sessionCookie || manualCookie);

  // Debug logging (check Vercel logs)
  console.log(`[Middleware] Path: ${pathname}`);
  console.log(`[Middleware] Session Cookie (helper): ${!!sessionCookie}`);
  console.log(`[Middleware] Session Cookie (manual): ${!!manualCookie}`);
  console.log(`[Middleware] Is Authenticated: ${isAuthenticated}`);

  // Protected routes - require authentication
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      console.log("[Middleware] No session, redirecting to /login");
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Auth routes - redirect to dashboard if already logged in
  if (authRoutes.includes(pathname) && isAuthenticated) {
    console.log("[Middleware] Already logged in, redirecting to /dashboard");
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};