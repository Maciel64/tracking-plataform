import { db } from "@/lib/adapters/firebase.adapter";
import { collection, getDocs, query, where } from "firebase/firestore";


interface MicrocontrollerResult {
    id: string;
    userId: string;
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
      const userId = data.user_id;
      
      
      // Criar o objeto de resultado com os valores corretos
      const result: MicrocontrollerResult = {
        id: microcontrollerDoc.id,
        userId: userId || ""
      };
      
      // Log do objeto de resultado para verificar
     
  
      return result;
    } catch (error) {
      console.error("Erro ao buscar microcontrolador:", error);
      throw error;
    }
  }