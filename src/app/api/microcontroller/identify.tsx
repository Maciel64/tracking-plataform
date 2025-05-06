import { NextRequest, NextResponse } from "next/server";
import { getMicrocontrollerId } from "./microcontroller.service";

//http://localhost:3000/api/identify

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const macAddress = body.macAddress;

    if (!macAddress) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "macAddress é obrigatório",
        },
        { status: 400 }
      );
    }

    const result = await getMicrocontrollerId(macAddress);

    return NextResponse.json({
      microcontroller: result.id,
      userId: result.userId,
    });
  } catch (error: any) {
    if (error.message && error.message.includes("não está registrado")) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: error.message,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Erro ao processar a solicitação",
      },
      { status: 500 }
    );
  }
}

// Opcional: Método GET para testes
export async function GET() {
  return NextResponse.json({ message: "Endpoint de identificação disponível" });
}
