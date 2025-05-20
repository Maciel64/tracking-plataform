import { Microcontroller } from "@/@types/microcontroller";
import { db } from "@/lib/adapters/firebase.adapter";
import { auth } from "@/auth";
import { firestoreAdapter } from "@/lib/adapters/firebase.adapter";
import { collection, limit, orderBy, query, where } from "firebase/firestore";
import { Coordinates } from "@/@types/coordinates";

export async function Microcontrollers() {
  const session = await auth();

  if (!session) {
    throw new Error("Usuário não autenticado");
  }

  let q;

  if (session.user.role === "ADMIN") {
    q = query(collection(db, "microcontrollers"));
  } else {
    q = query(
      collection(db, "microcontrollers"),
      where("user_id", "==", session.user.id)
    );
  }

  const microcontrollersSnapshot = await firestoreAdapter.getDocs(q);

  const microcontrollersPromises = microcontrollersSnapshot.docs.map(
    async (doc) => {
      const data = doc.data();
      const coordinatesSnapshot = await firestoreAdapter.getDocs(
        query(
          collection(db, "coordinates"),
          where("microcontroller_uid", "==", doc.ref.id),
          orderBy("created_at", "desc"),
          limit(1)
        )
      );

      const coordinatesPromises = coordinatesSnapshot.docs.map(
        async (coordDoc) => {
          const coordData = coordDoc.data();
          return {
            uid: coordDoc.id,
            ...coordData,
          } as Coordinates;
        }
      );

      const coordinates = await Promise.all(coordinatesPromises);

      return {
        uid: doc.id,
        ...data,
        coordinates,
      } as Microcontroller;
    }
  );

  return await Promise.all(microcontrollersPromises);
}
