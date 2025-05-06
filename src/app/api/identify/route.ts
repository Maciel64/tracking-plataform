import { NextRequest, NextResponse } from "next/server";
import { getMicrocontrollerId } from "./microcontroller.service";

export async function POST(request: NextRequest) {
  try {
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
    
    
    
    try {
      // Usar o serviço para buscar o microcontrolador
      const result = await getMicrocontrollerId(macAddress);
      
      // Log do resultado antes de retornar
      
      
      // Garantir que estamos retornando os campos corretos
      const response = {
        microcontroller: result.id,
        userId: result.userId
      };
      
      
      
      return NextResponse.json(response);
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
      throw error;
    }
    
  } catch (error: any) {
    console.error("Erro no endpoint de identificação:", error);
    
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