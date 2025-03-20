import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    const response = await handleRequest(request);
    return response;
  } catch (error) {
    return handleError(error);
  }
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
