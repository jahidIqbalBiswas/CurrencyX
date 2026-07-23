import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import {
  AUTH_COOKIE_NAME,
  PROTECTED_ROUTES,
  AUTH_ROUTES,
  RATE_LIMIT_AUTH_MAX,
  RATE_LIMIT_API_MAX,
  RATE_LIMIT_WINDOW_MS,
} from "@/constants";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return new TextEncoder().encode(secret);
}

/** Simple in-memory rate limiter for edge runtime */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function edgeRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

function isAdminPageRoute(pathname: string): boolean {
  return pathname.startsWith("/admin/dashboard");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const identifier =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "anonymous";

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    const maxRequests = isAuthRoute(pathname)
      ? RATE_LIMIT_AUTH_MAX
      : RATE_LIMIT_API_MAX;

    const allowed = edgeRateLimit(
      `${identifier}:${isAuthRoute(pathname) ? "auth" : "api"}`,
      maxRequests,
      RATE_LIMIT_WINDOW_MS
    );

    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  // Authentication guard for protected routes
  if (isProtectedRoute(pathname)) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      if (isAdminPageRoute(pathname)) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    try {
      await jwtVerify(token, getJwtSecret());
    } catch {
      if (isAdminPageRoute(pathname)) {
        const response = NextResponse.redirect(
          new URL("/admin/login", request.url)
        );
        response.cookies.delete(AUTH_COOKIE_NAME);
        return response;
      }
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  }

  // Redirect authenticated users away from login page
  if (pathname === "/admin/login") {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (token) {
      try {
        await jwtVerify(token, getJwtSecret());
        return NextResponse.redirect(
          new URL("/admin/dashboard", request.url)
        );
      } catch {
        // Token invalid — let them reach login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
  ],
};
