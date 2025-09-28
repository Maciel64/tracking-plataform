import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const routesByRole = {
  ADMIN: ["*"],
  USER: ["/microcontrollers", "/maps", "/profile", "/settings", "/dashboard"],
};

type MiddlewareUser = {
  role?: string;
};

const publicRoutes = ["/auth/login", "/auth/register", "/", "/api/identify"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ??
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  let user: MiddlewareUser | null = null;

  try {
    const { payload } = await jwtVerify(
      sessionToken,
      new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
    );

    user = { role: payload.role as string };
  } catch (e) {
    console.error("Invalid session token:", e);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const role = user?.role?.toUpperCase();

  if (roleCanAccessPath({ role, path })) {
    return NextResponse.next();
  }

  return NextResponse.error();
}

function roleCanAccessPath({ role, path }: { role?: string; path: string }) {
  if (!role) return false;

  const userRoutes = routesByRole[role as keyof typeof routesByRole];

  if (!userRoutes) {
    console.error(
      "ERR:middleware.ts: Something went wrong with roles management"
    );
    console.error("Current role: ", role);
    console.error("Current path: ", path);
    return false;
  }

  if (userRoutes.includes("*")) return true;

  return userRoutes.includes(path);
}

export const config = {
  matcher: ["/((?!api/identify|api/|_next/static|_next/image|favicon.ico).*)"],
};
