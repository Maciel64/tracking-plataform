import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const publicRoutes = ["/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const session = await auth();
  const path = request.nextUrl.pathname;

  if (!session?.user && !publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico).*)"],
};
