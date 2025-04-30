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
      const q = query(microcontrollersRef, where("mac_address", "==", macAddress));
      const querySnapshot = await getDocs(q);
  
      console.log(`Resultados encontrados: ${querySnapshot.size}`);
  
      if (querySnapshot.empty) {
        throw new Error(`Microcontrolador com MAC ${macAddress} não está registrado`);
      }
  
      // Pega o primeiro documento encontrado
      const microcontrollerDoc = querySnapshot.docs[0];
      const data = microcontrollerDoc.data();
  
      console.log(`Microcontrolador encontrado: ${microcontrollerDoc.id}`);
      
      // Acessar diretamente o campo user_id e fazer log do valor
      const userId = data.user_id;
      console.log(`Valor do campo user_id: "${userId}"`);
      
      // Criar o objeto de resultado com os valores corretos
      const result: MicrocontrollerResult = {
        id: microcontrollerDoc.id,
        userId: userId || ""
      };
      
      // Log do objeto de resultado para verificar
      console.log(`Objeto de resultado: ${JSON.stringify(result)}`);
  
      return result;
    } catch (error) {
      console.error("Erro ao buscar microcontrolador:", error);
      throw error;
    }
  }