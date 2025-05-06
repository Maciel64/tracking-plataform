import { NextRequest, NextResponse } from "next/server";
import { getMicrocontrollerId } from "./microcontroller.service";
import fs from "fs";

// Função para logging em arquivo (para garantir que estamos vendo os logs)
function logToFile(message: string) {
  try {
    fs.appendFileSync(
      "/tmp/debug.log",
      `${new Date().toISOString()}: ${message}\n`
    );
  } catch (e) {
    // Ignora erros de escrita em arquivo
  }
}

const generateUserId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export async function POST(request: NextRequest) {
  // Log direto no console com caracteres distintivos
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.log("!!! [IDENTIFY] INÍCIO DA REQUISIÇÃO POST !!!");
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

  // Também tenta logar em arquivo
  logToFile("[IDENTIFY] Iniciando processamento da requisição POST");

  try {
    // Força um erro para ver se o tratamento de erros está funcionando
    if (Math.random() < 0.5) {
      throw new Error("ERRO DE TESTE FORÇADO");
    }

    console.log("📦 [IDENTIFY] Extraindo corpo da requisição");
    logToFile("[IDENTIFY] Extraindo corpo da requisição");

    const body = await request.json();
    console.log("📦 [IDENTIFY] Corpo:", JSON.stringify(body));
    logToFile(`[IDENTIFY] Corpo: ${JSON.stringify(body)}`);

    const macAddress = body.macAddress;
    const id = body.id;
    const coordinates = body.coordinates;

    if (!macAddress || !id || !coordinates) {
      console.log("❌ [IDENTIFY] Dados inválidos");
      logToFile("[IDENTIFY] Dados inválidos");
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "macAddress, id e coordinates são obrigatórios",
        },
        { status: 400 }
      );
    }

    console.log("🔍 [IDENTIFY] Buscando microcontrolador:", macAddress);
    logToFile(`[IDENTIFY] Buscando microcontrolador: ${macAddress}`);

    const result = await getMicrocontrollerId(macAddress);
    console.log("✅ [IDENTIFY] Resultado:", JSON.stringify(result));
    logToFile(`[IDENTIFY] Resultado: ${JSON.stringify(result)}`);

    if (!result.userId) {
      const newUserId = generateUserId();
      result.userId = newUserId;
      console.log("🆕 [IDENTIFY] Novo userId:", newUserId);
      logToFile(`[IDENTIFY] Novo userId: ${newUserId}`);
    }

    console.log("🏁 [IDENTIFY] Retornando sucesso");
    logToFile("[IDENTIFY] Retornando sucesso");

    return NextResponse.json({
      microcontroller: result.id,
      userId: result.userId,
      coordinates: coordinates,
    });
  } catch (error: any) {
    console.error("!!! ERRO CAPTURADO !!!");
    console.error(error);
    logToFile(`[IDENTIFY] ERRO: ${error.message}`);

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
        message: "Erro ao processar a solicitação: " + error.message,
      },
      { status: 500 }
    );
  }
}

// Método GET para testes
export async function GET() {
  console.log("!!! [IDENTIFY] REQUISIÇÃO GET RECEBIDA !!!");
  logToFile("[IDENTIFY] Requisição GET recebida");

  return NextResponse.json({
    message: "Endpoint de identificação disponível",
    timestamp: new Date().toISOString(),
  });
}
