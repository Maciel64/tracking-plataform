import { Coordinate, Microcontroller } from "@/@types/microcontroller";
import { db } from "@/lib/adapters/firebase.adapter";
import { auth } from "@/auth";
import { firestoreAdapter } from "@/lib/adapters/firebase.adapter";
import { collection, query, where } from "firebase/firestore";

export async function Microcontrollers() {
  const session = await auth();

  if (!session) {
    throw new Error("Usuário não autenticado");
  }

  const microcontrollersSnapshot = await firestoreAdapter.getDocs(
    query(
      collection(db, "microcontrollers"),
      session.user.role === "ADMIN"
        ? where("userId", "==", session.user.id)
        : where("userId", "==", session.user.id)
    )
  );

  const microcontrollersPromises = microcontrollersSnapshot.docs.map(
    async (doc) => {
      const data = doc.data();
      const coordinatesSnapshot = await firestoreAdapter.getDocs(
        query(
          collection(db, "coordinates"),
          where("microcontroller", "==", doc.ref)
        )
      );

      const coordinatesPromises = coordinatesSnapshot.docs.map(
        async (coordDoc) => {
          const coordData = coordDoc.data();
          return {
            uid: coordDoc.id,
            ...coordData,
          } as Coordinate;
        }
      );

      return {
        uid: doc.id,
        ...data,
        coordinates: await Promise.all(coordinatesPromises),
      } as Microcontroller;
    }
  );

  return await Promise.all(microcontrollersPromises);
}
