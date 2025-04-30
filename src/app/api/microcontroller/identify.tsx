import { NextRequest, NextResponse } from "next/server";
import { getMicrocontrollerId } from "./microcontroller.service";

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

    console.log(
      `Recebida solicitação de identificação para MAC: ${macAddress}`
    );

    const result = await getMicrocontrollerId(macAddress);
    console.log(`Microcontrolador identificado: ${JSON.stringify(result)}`);

    return NextResponse.json({
      microcontroller: result.id,
      userId: result.userId,
    });
  } catch (error: any) {
    console.error("Erro no endpoint de identificação:", error);

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
