import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const routesByRole = {
  ADMIN: ["*"],
  USER: ["/microcontrollers", "/maps", "/profile", "/settings", "/dashboard"],
};

const publicRoutes = ["/auth/login", "/auth/register", "/", "/api/identify"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName:
      process.env.VERCEL_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
  });

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const role = (token.role as string | undefined)?.toUpperCase();

  if (roleCanAccessPath({ role, path })) {
    return NextResponse.next();
  }

  return NextResponse.error();
}

function roleCanAccessPath({ role, path }: { role?: string; path: string }) {
  if (!role) return false;

  const userRoutes = routesByRole[role as keyof typeof routesByRole];
  if (!userRoutes) return false;

  if (userRoutes.includes("*")) return true;

  return userRoutes.includes(path);
}

export const config = {
  matcher: ["/((?!api/identify|api/|_next/static|_next/image|favicon.ico).*)"],
};
