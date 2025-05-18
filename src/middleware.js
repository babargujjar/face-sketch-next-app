import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("authToken")?.value;
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = ["/", "/similerity"];
  const isProtected = protectedRoutes.includes(pathname);

  // ✅ If user tries to access protected routes without token
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // ✅ If user visits /auth with token, log them out
  if (pathname === "/auth" && token) {
    const response = NextResponse.redirect(new URL("/auth", request.url));
    response.cookies.set("authToken", "", {
      path: "/",
      maxAge: 0,
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/similerity"],
};
