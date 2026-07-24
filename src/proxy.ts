import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const adminPaths = ["/admin", "/api/admin"];
const studentPaths = ["/student", "/api/student"];

function pathnameStartsWith(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieNames = Array.from(request.cookies.keys()).join(",");
  const sessionToken = request.cookies.get("__Secure-authjs.session-token")?.value
    ?? request.cookies.get("authjs.session-token")?.value;

  const hasSession = !!sessionToken;

  const response = NextResponse.next();
  response.headers.set("x-proxy-cookies", cookieNames || "NONE");
  response.headers.set("x-proxy-has-session", String(hasSession));

  if (pathnameStartsWith(pathname, adminPaths)) {
    if (!hasSession) {
      const signInUrl = new URL("/auth/signin", request.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  if (pathnameStartsWith(pathname, studentPaths)) {
    if (!hasSession) {
      const signInUrl = new URL("/auth/signin", request.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
    "/api/admin/:path*",
    "/api/student/:path*",
  ],
};
