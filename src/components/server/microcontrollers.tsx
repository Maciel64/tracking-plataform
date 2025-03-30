import { Coordinate, Microcontroller } from "@/@types/microcontroller";
import { db } from "@/lib/adapters/firebase.adapter";

import { firestoreAdapter } from "@/lib/adapters/firebase.adapter";
import { collection, query, where } from "firebase/firestore";

export async function Microcontrollers() {
  const microcontrollersSnapshot = await firestoreAdapter.getDocs(
    firestoreAdapter.collection(db, "microcontrollers")
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
