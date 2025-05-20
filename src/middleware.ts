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
  USER: ["/microcontrollers", "/maps", "/profile", "/settings", "/dashboard"],
};

// Adicione a rota do identify às rotas públicas
const publicRoutes = ["/auth/login", "/auth/register", "/", "/api/identify"];

export async function middleware(request: NextRequest) {
  const session = await auth();
  const user = session?.user as User | null;
  const path = request.nextUrl.pathname;

  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }
  
  // Você também pode verificar se a rota começa com /api/identify
  if (path.startsWith("/api/identify")) {
    return NextResponse.next();
  }
  
  const role = user?.role?.toUpperCase();

  const isValidRole =
    typeof role === "string" && Object.keys(routesByRole).includes(role);
  
  const userCanAccess =
    isValidRole && routesByRole[role as keyof typeof routesByRole]?.includes(path);

  if (!userCanAccess) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.error();
  }

  return NextResponse.next();
}

export const config = {
  // Modifique o matcher para excluir a rota /api/identify
  matcher: ["/((?!api/identify|api/|_next/static|_next/image|favicon.ico).*)"],
};
