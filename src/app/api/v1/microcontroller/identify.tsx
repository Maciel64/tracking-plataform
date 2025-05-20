import { NextRequest, NextResponse } from "next/server";
import { getMicrocontrollerId } from "../../../../domain/repositories/microcontroller.repository";

export async function POST(request: NextRequest) {
  try {
    console.log("Requisição POST recebida");

    let body;
    try {
      console.log("Tentando parsear o corpo da requisição");
      body = await request.json();
      console.log("Corpo da requisição parseado com sucesso");
    } catch (error: unknown) {
      console.error("Erro ao parsear o corpo da requisição", error);
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Corpo da requisição inválido",
        },
        { status: 400 }
      );
    }

    console.log("Corpo da requisição:", body);

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

    console.log("macAddress:", macAddress);

    try {
      console.log("Tentando buscar o microcontrolador");
      const result = await getMicrocontrollerId(macAddress);
      console.log("Microcontrolador encontrado com sucesso");

      console.log("Resultado:", result);

      // Retornar os dados do microcontrolador
      const response = {
        microcontroller: result.id,
        userId: result.userId,
      };

      console.log("Resposta:", response);

      return NextResponse.json(response);
    } catch (error: unknown) {
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
  } catch (error: unknown) {
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
  console.log("Requisição GET recebida");
  return NextResponse.json({ message: "Endpoint de identificação disponível" });
}
