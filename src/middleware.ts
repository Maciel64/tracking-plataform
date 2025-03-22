import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { headers: response.headers });
  }

  return response;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function handleRequest(request: NextRequest) {
  const response = NextResponse.next();
  return response;
}

// Classe de erro personalizado
export class CustomError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "CustomError";
  }
}

export function handleError(error: unknown) {
  console.error("Entrou no error handler:");

  let status = 500;
  let message = "Erro interno do servidor";

  if (error instanceof CustomError) {
    status = error.statusCode;
    message = error.message;
  }

  return NextResponse.json(
    {
      error: {
        message,
        status,
      },
    },
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export const config = {
  matcher: "/api/:path*",
};
