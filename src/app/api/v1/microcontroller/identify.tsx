import { NextRequest, NextResponse } from "next/server";
import { getMicrocontrollerId } from "@/domain/repositories/microcontroller.repository";

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
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const microcontrollerId = await getMicrocontrollerId(macAddress);

    if (!microcontrollerId) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Microcontrolador não encontrado",
        },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return NextResponse.json(
      {
        id: microcontrollerId,
      },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Erro ao processar a solicitação",
      },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
