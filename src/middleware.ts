import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = 'nodejs';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public access to login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Check authentication for all admin routes except login
  if (pathname.startsWith("/admin")) {
    const sessionToken = request.cookies.get("next-auth.session-token") || request.cookies.get("__Secure-next-auth.session-token");
    
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
