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
    console.log("Iniciando busca de microcontrolador pelo MAC:", macAddress);
    
    // Consulta para encontrar o microcontrolador pelo MAC address
    const microcontrollersRef = collection(db, "microcontrollers");
    const q = query(microcontrollersRef, where("mac_address", "==", macAddress));
    const querySnapshot = await getDocs(q);
    
    console.log("Resultado da busca:", querySnapshot.empty ? "Nenhum encontrado" : "Encontrado");
    
    if (querySnapshot.empty) {
      throw new Error(`Microcontrolador com MAC ${macAddress} não está registrado`);
    }

    // Pega o primeiro documento encontrado
    const microcontrollerDoc = querySnapshot.docs[0];
    const data = microcontrollerDoc.data();
    
    console.log("Dados do microcontrolador:", data);

    // Acessar diretamente o campo user_id e fazer log do valor
    const userId = data.user_id as string;
    console.log("User ID do microcontrolador:", userId);

    // Criar o objeto de resultado com os valores corretos
    const result: MicrocontrollerResult = {
      id: microcontrollerDoc.id,
      userId,
      user_uid: undefined
    };
    
    console.log("Resultado final:", result);
    
    return result;
  } catch (error) {
    console.error("Erro ao buscar microcontrolador:", error);
    throw error;
  }
}

export async function saveCoordinate(coordinate: Coordinate): Promise<void> {
  try {
    console.log("Iniciando salvamento de coordenada:", coordinate);
    
    // Verificar se todos os campos necessários estão presentes
    if (!coordinate.microcontroller_uid || !coordinate.user_id || 
        coordinate.latitude === undefined || coordinate.longitude === undefined ||
        !coordinate.created_at) {
      console.error("Dados de coordenada incompletos:", coordinate);
      throw new Error("Dados de coordenada incompletos");
    }
    
    // Converter o objeto Date para um formato que o Firestore possa armazenar
    const coordinateToSave = {
      ...coordinate,
      created_at: coordinate.created_at instanceof Date ? coordinate.created_at : new Date(coordinate.created_at)
    };
    
    console.log("Coordenada a ser salva:", coordinateToSave);
    
    const coordinatesRef = collection(db, "coordinates");
    const docRef = await addDoc(coordinatesRef, coordinateToSave);
    
    console.log("Coordenada salva com sucesso. ID:", docRef.id);
  } catch (error) {
    console.error("Erro ao salvar coordenada:", error);
    throw error;
  }
}
