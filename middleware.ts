// middleware.ts
// Place this file in the ROOT of your project (same level as package.json)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard"];

// Routes that should redirect to dashboard if already logged in
const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the session token from cookies
  // Better Auth uses "better-auth.session_token" by default
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;
  
  const isAuthenticated = !!sessionToken;
  
  // Log for debugging (remove in production)
  console.log(`[Middleware] Path: ${pathname}, Has Session: ${isAuthenticated}`);

  // Check if trying to access protected route without auth
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      console.log("[Middleware] No session, redirecting to /login");
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Optional: Redirect logged-in users away from auth pages
  // Uncomment if you want this behavior
  // if (authRoutes.includes(pathname) && isAuthenticated) {
  //   console.log("[Middleware] Already logged in, redirecting to /dashboard");
  //   const dashboardUrl = new URL("/dashboard", request.url);
  //   return NextResponse.redirect(dashboardUrl);
  // }

  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Match all routes except static files and api
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};