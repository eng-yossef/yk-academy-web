import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const adminPaths = ["/admin", "/api/admin"];
const studentPaths = ["/student", "/api/student"];

function pathnameStartsWith(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (pathnameStartsWith(pathname, adminPaths)) {
    if (!session) {
      const signInUrl = new URL("/auth/signin", req.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (session.user?.role !== "ADMIN" && session.user?.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
  }

  if (pathnameStartsWith(pathname, studentPaths)) {
    if (!session) {
      const signInUrl = new URL("/auth/signin", req.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
    "/api/admin/:path*",
    "/api/student/:path*",
  ],
};
