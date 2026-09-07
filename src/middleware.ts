import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (
    process.env.NODE_ENV === "production" &&
    request.nextUrl.pathname.startsWith("/master")
  ) {
    return NextResponse.rewrite(new URL("/missing", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/master", "/master/:path*"],
};
