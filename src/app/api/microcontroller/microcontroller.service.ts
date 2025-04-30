import { db } from "@/lib/adapters/firebase.adapter";
import { collection, getDocs, query, where } from "firebase/firestore";

interface MicrocontrollerResult {
  id: string;
  userId: string;
}

export async function getMicrocontrollerId(macAddress: string): Promise<MicrocontrollerResult> {
  try {
    console.log(`Buscando microcontrolador com MAC: ${macAddress}`);
    
    // Consulta para encontrar o microcontrolador pelo MAC address
    const microcontrollersRef = collection(db, "microcontrollers");
    const q = query(microcontrollersRef, where("macAddress", "==", macAddress));
    const querySnapshot = await getDocs(q);

    console.log(`Resultados encontrados: ${querySnapshot.size}`);

    if (querySnapshot.empty) {
      throw new Error(`Microcontrolador com MAC ${macAddress} não está registrado`);
    }

    // Pega o primeiro documento encontrado
    const microcontrollerDoc = querySnapshot.docs[0];
    const microcontrollerData = microcontrollerDoc.data();

    console.log(`Microcontrolador encontrado: ${microcontrollerDoc.id}`);

    return {
      id: microcontrollerDoc.id,
      userId: microcontrollerData.userId || "",
    };
  } catch (error) {
    console.error("Erro ao buscar microcontrolador:", error);
    throw error;
  }
}
