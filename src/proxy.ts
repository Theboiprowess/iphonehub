import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // TEMPORARILY DISABLED FOR DEBUGGING
  // Commenting out proxy logic to identify if it's causing the page load error
  console.log("Proxy disabled - allowing all admin routes");
  return NextResponse.next();

  // Original proxy logic (disabled):
  /*
  // Allow public access to login page and API routes (API handles auth separately)
  if (pathname === "/admin/login" || pathname.startsWith("/admin/api")) {
    return NextResponse.next();
  }

  // Check authentication for all admin routes except login and API
  if (pathname.startsWith("/admin")) {
    const sessionToken = request.cookies.get("next-auth.session-token") || request.cookies.get("__Secure-next-auth.session-token");
    
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
  */
}

export const config = {
  matcher: "/admin/:path*",
};
