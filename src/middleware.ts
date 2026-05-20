import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isLoggedIn = !!session;

  const isAdminPath = nextUrl.pathname.startsWith("/admin");
  const isProtectedPath =
    nextUrl.pathname.startsWith("/chat") ||
    nextUrl.pathname.startsWith("/sessions") ||
    nextUrl.pathname.startsWith("/profile") ||
    isAdminPath;

  if (isProtectedPath && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${nextUrl.pathname}`, nextUrl),
    );
  }

  if (isAdminPath && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/chat", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
