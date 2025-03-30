import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { User } from "./@types/user";

const routesByRole = {
  ADMIN: [
    "/profile",
    "/dashboard",
    "/users",
    "/settings",
    "/microcontrollers",
    "/maps",
  ],
  USER: ["/profile", "/settings"],
};

const publicRoutes = ["/auth/login", "/auth/register", "/"];

export async function middleware(request: NextRequest) {
  const session = await auth();
  const user = session?.user as User | null;
  const path = request.nextUrl.pathname;

  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  const userCanAccess = user ? routesByRole[user.role].includes(path) : false;

  if (!userCanAccess) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.error();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico).*)"],
};
