import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // if the user is trying to access a protected page
  const protectedRoutes = [/^\/home(?:\/|$)/];
  const walletAddress =
    req.cookies.get("walletAddress") || req.headers.get("walletAddress");

  if (protectedRoutes.some((route) => route.test(pathname))) {
    // check for walletAddress existing in cookies
    if (!walletAddress || walletAddress?.value.length < 1) {
      // return to login page
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*"],
};
