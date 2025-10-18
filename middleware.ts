import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Let the request pass through - locale is handled by cookies
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
