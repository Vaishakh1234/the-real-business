import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import type { AdminSession } from "@/types";

const SESSION_OPTIONS = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
};

/**
 * Admin route guard + `x-pathname` for `app/(admin)/admin/layout.tsx` so
 * `/admin/login` can render without the authenticated shell (see layout).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  /** Per-user manifest (admin shortcuts); prevent shared caches from mixing variants. */
  if (pathname === "/manifest.webmanifest") {
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Vary", "Cookie");
    return response;
  }

  if (pathname === "/admin" || pathname === "/admin/") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  if (pathname.startsWith("/admin/")) {
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    const session = await getIronSession<AdminSession>(
      request,
      response,
      SESSION_OPTIONS,
    );

    if (!session.isAdmin) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/manifest.webmanifest", "/admin", "/admin/", "/admin/:path*"],
};
