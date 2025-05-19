import { db } from "@/lib/adapters/firebase.adapter";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";

interface MicrocontrollerResult {
  user_uid: string | undefined;
  id: string;
  userId: string;
}

export interface Coordinate {
  microcontroller_uid: string;
  user_id: string;
  latitude: number;
  longitude: number;
  created_at: Date;
}

export async function getMicrocontrollerId(macAddress: string): Promise<MicrocontrollerResult> {
  try {
    // Consulta para encontrar o microcontrolador pelo MAC address
    const microcontrollersRef = collection(db, "microcontrollers");
    const q = query(microcontrollersRef, where("mac_address", "==", macAddress));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error(`Microcontrolador com MAC ${macAddress} não está registrado`);
    }

    // Pega o primeiro documento encontrado
    const microcontrollerDoc = querySnapshot.docs[0];
    const data = microcontrollerDoc.data();

    // Acessar diretamente o campo user_id e fazer log do valor
    const userId = data.user_id as string;

    // Criar o objeto de resultado com os valores corretos
    const result: MicrocontrollerResult = {
      id: microcontrollerDoc.id,
      userId,
      user_uid: undefined
    };

    return result;
  } catch (error) {
    console.error("Erro ao buscar microcontrolador:", error);
    throw error;
  }
}

export async function saveCoordinate(coordinate: Coordinate): Promise<void> {
  try {
    const coordinatesRef = collection(db, "coordinates");
    await addDoc(coordinatesRef, coordinate);
  } catch (error) {
    console.error("Erro ao salvar coordenada:", error);
    throw error;
  }
}