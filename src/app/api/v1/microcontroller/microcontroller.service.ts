import { NextRequest, NextResponse } from "next/server";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getMicrocontrollerId } from "../../../../domain/repositories/microcontroller.repository";

const db = getFirestore();

const generateUserId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const macAddress = body.macAddress;
    const id = body.id;
    const latitude = body.latitude;
    const longitude = body.longitude;

    if (!macAddress || !id || !latitude || !longitude) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "macAddress, id, latitude e longitude são obrigatórios",
        },
        { status: 400 }
      );
    }

    const result = await getMicrocontrollerId(macAddress);

    if (!result.userId) {
      // Gera um novo ID do usuário
      const newUserId = generateUserId();
      result.userId = newUserId;
    }

    const coordinatesRef = collection(db, "coordinates");
    console.log("Dados a serem salvos:", {
      macAddress,
      id,
      latitude,
      longitude,
    });

    try {
      await addDoc(coordinatesRef, {
        macAddress,
        id,
        latitude,
        longitude,
      });
    } catch (error: unknown) {
      console.error("Erro ao salvar os dados", error);
      throw error;
    }

    return NextResponse.json({ message: "Dados salvos com sucesso" });
  } catch (error: unknown) {
    console.error("Erro no endpoint de microcontrolador", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Erro ao processar a solicitação",
      },
      { status: 500 }
    );
  }
}