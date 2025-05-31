import { NextRequest, NextResponse } from "next/server";
import {
  getMicrocontrollerId,
  saveCoordinate,
  Coordinate,
} from "@/domain/repositories/microcontroller.repository";

export async function POST(request: NextRequest) {
  try {
    console.log("==== INÍCIO DO PROCESSAMENTO DA REQUISIÇÃO POST ====");

    let body;
    try {
      console.log("Tentando parsear o corpo da requisição");
      body = await request.json();
      console.log("Corpo da requisição parseado com sucesso:", body);
    } catch (e) {
      console.error("Erro ao parsear o corpo da requisição", e);
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Corpo da requisição inválido",
        },
        { status: 400 }
      );
    }

    const macAddress = body.macAddress as string;
    const userId = body.user_id as string;
    const latitude = body.latitude as number;
    const longitude = body.longitude as number;

    console.log("Dados extraídos:", {
      macAddress,
      userId,
      latitude,
      longitude,
    });

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

    if (!userId) {
      console.error("userId não fornecido");
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "userId é obrigatório",
        },
        { status: 400 }
      );
    }

    if (latitude === undefined || longitude === undefined) {
      console.error("Coordenadas não fornecidas");
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Coordenadas são obrigatórias",
        },
        { status: 400 }
      );
    }

    if (latitude < -90 || latitude > 90) {
      console.error("Latitude inválida");
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Latitude deve estar entre -90 e 90",
        },
        { status: 400 }
      );
    }

    if (longitude < -180 || longitude > 180) {
      console.error("Longitude inválida");
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Longitude deve estar entre -180 e 180",
        },
        { status: 400 }
      );
    }

    console.log("Validações passaram, verificando usuário:", userId);

    // Buscar o microcontrolador
    try {
      console.log("==== BUSCANDO MICROCONTROLADOR ====", { macAddress });
      const result = await getMicrocontrollerId(macAddress);
      console.log("Microcontrolador encontrado com sucesso. ID:", result.id);

      // Salvar a coordenada no banco
      const coordinate: Coordinate = {
        microcontroller_uid: result.id,
        user_id: userId,
        latitude,
        longitude,
        created_at: new Date(),
      };

      console.log(
        "==== SALVANDO COORDENADA ====",
        JSON.stringify(coordinate, null, 2)
      );

      try {
        await saveCoordinate(coordinate);
        console.log("==== COORDENADA SALVA COM SUCESSO ====");
      } catch (saveError) {
        console.error("Erro ao salvar coordenada:", saveError);
        throw saveError;
      }

      // Retornar mensagem de sucesso
      return NextResponse.json({ message: "Coordenada salva com sucesso!" });
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
    console.error("Erro no endpoint de coordenadas:", error);

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
  return NextResponse.json({ message: "Endpoint de coordenadas disponível" });
}
