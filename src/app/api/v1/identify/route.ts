import { NextRequest, NextResponse } from "next/server";
import { getMicrocontrollerId } from "../../../../domain/microcontrollers/microcontroller.repository";

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Erro ao parsear o corpo da requisição", error);
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Corpo da requisição inválido",
        },
        { status: 400 }
      );
    }

    const macAddress = body.macAddress as string;

    if (!macAddress) {
      console.error("macAddress não fornecido");
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "macAddress é obrigatório",
        },
        { status: 400 }
      );
    }

    try {
      const result = await getMicrocontrollerId(macAddress);

      // Retornar os dados do microcontrolador
      const response = {
        microcontroller: result.id,
        userId: result.userId,
      };

      return NextResponse.json(response);
    } catch (error) {
      console.error("Erro ao buscar o microcontrolador", error);

      if (
        error instanceof Error &&
        error.message &&
        error.message.includes("não está registrado")
      ) {
        console.error("Microcontrolador não encontrado");
        return NextResponse.json(
          {
            error: "Not Found",
            message: error.message,
          },
          { status: 404 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Erro no endpoint de identificação", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Erro ao processar a solicitação",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Endpoint de identificação disponível" });
}
