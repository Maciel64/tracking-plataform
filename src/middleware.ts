import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { User } from "./domain/users/user.model";

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

  const user = (await auth())?.user as User | null;

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const role = user?.role?.toUpperCase();

  if (roleCanAccessPath({ role, path })) {
    return NextResponse.next();
  }

  return NextResponse.error();
}

function roleCanAccessPath({ role, path }: { role: string; path: string }) {
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

  return userRoutes?.includes(path);
}

export const config = {
  // Modifique o matcher para excluir a rota /api/identify
  matcher: ["/((?!api/identify|api/|_next/static|_next/image|favicon.ico).*)"],
};
