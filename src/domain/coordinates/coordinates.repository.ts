import { Microcontroller } from "@/domain/microcontrollers/microcontroller.model";
import { Coordinate } from "@/@types/coordinates";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  DocumentData,
  Firestore,
} from "firebase/firestore";

export class CoordinatesRepository {
  private firestore: Firestore;

  constructor(firestoreAdapter: Firestore) {
    this.firestore = firestoreAdapter;
  }

  public async findMicrocontrollerByMac(
    mac: string
  ): Promise<Microcontroller | null> {
    try {
      const microcontrollersRef = collection(
        this.firestore,
        "microcontrollers"
      );
      const microcontrollerRef = doc(microcontrollersRef, mac);
      const microcontrollerDoc = await getDoc(microcontrollerRef);

      if (microcontrollerDoc.exists()) {
        return microcontrollerDoc.data() as Microcontroller;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar microcontrolador:", error);
      throw error;
    }
  }

  public async findUserById(user_id: string): Promise<DocumentData | null> {
    try {
      const usersRef = collection(this.firestore, "users");
      const userRef = doc(usersRef, user_id);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      throw error;
    }
  }

  public async create(coordinate: Coordinate): Promise<Coordinate> {
    try {
      const coordinatesRef = collection(this.firestore, "coordinates");
      await addDoc(coordinatesRef, coordinate);
      // Retorna o objeto coordinate original, já que não estamos modificando-o
      return coordinate;
    } catch (error) {
      console.error("Erro ao criar coordenada:", error);
      throw error;
    }
  }

  public async find(): Promise<Coordinate[]> {
    try {
      const coordinatesRef = collection(this.firestore, "coordinates");
      const coordinatesDocs = await getDocs(coordinatesRef);
      const coordinates = coordinatesDocs.docs.map(
        (doc) => doc.data() as Coordinate
      );
      return coordinates;
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error);
      throw error;
    }
  }
}
