import { NextRequest, NextResponse } from "next/server";
import { getMicrocontrollerId } from "@/app/api/microcontroller/microcontroller.service";

export async function POST(request: NextRequest) {
  try {
    // Certifique-se de que o parsing do JSON não falhe
    let body;
    try {
      body = await request.json();
    } catch (e) {
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
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "macAddress é obrigatório",
        },
        { status: 400 }
      );
    }
    
    console.log(`Recebida solicitação de identificação para MAC: ${macAddress}`);
    
    try {
      // Usar o serviço real para buscar o microcontrolador
      const result = await getMicrocontrollerId(macAddress);
      
      return NextResponse.json({
        microcontroller: result.id,
        userId: result.userId
      });
    } catch (error: any) {
      if (error.message && error.message.includes("não está registrado")) {
        return NextResponse.json(
          {
            error: "Not Found",
            message: error.message
          },
          { status: 404 }
        );
      }
      throw error; // Re-throw para ser capturado pelo catch externo
    }
    
  } catch (error: any) {
    console.error("Erro no endpoint de identificação:", error);
    
    // Garantir que sempre retorne uma resposta mesmo em caso de erro
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