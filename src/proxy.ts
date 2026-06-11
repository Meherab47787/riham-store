import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "riham-fallback-secret"
);

const SUPER_ADMIN_ONLY = ["/admin/staff", "/admin/settings"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const token = request.cookies.get("riham-session")?.value;

  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", "admin");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const role = payload.role as string;

    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (SUPER_ADMIN_ONLY.some((p) => pathname.startsWith(p)) && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Forward x-is-admin so root layout skips the store Navbar/Footer
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-is-admin", "1");
    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", "admin");
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
