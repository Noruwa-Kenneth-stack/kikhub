import { NextResponse } from "next/server";

export function middleware(req) {
  const auth = req.cookies.get("auth")?.value;
  const role = req.cookies.get("role")?.value;

  // If visiting /dashboard but not admin → block
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!auth || role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
