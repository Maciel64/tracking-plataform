import { Coordinate as TCoordinates } from "@/@types/coordinates";
import { Microcontroller } from "@/domain/microcontrollers/microcontroller.model";
import { db, firestoreAdapter } from "@/lib/adapters/firebase.adapter";

export async function Coordinates() {
  const coordinatesSnapshot = await firestoreAdapter.getDocs(
    firestoreAdapter.collection(db, "coordinates")
  );

  const coordinatesPromises = coordinatesSnapshot.docs.map(async (doc) => {
    const data = doc.data();

    const microcontrollerRef = data.microcontroller;
    const microcontrollerDoc = await firestoreAdapter.getDoc(
      microcontrollerRef
    );
    const microcontrollerData = microcontrollerDoc.data() as Omit<
      Microcontroller,
      "uid"
    >;

    return {
      uid: doc.id,
      latitude: data.latitude,
      longitude: data.longitude,
      microcontroller_uid: microcontrollerDoc.id,
      microcontroller: {
        uid: microcontrollerDoc.id,
        ...microcontrollerData,
      } as Microcontroller,
    } as unknown as TCoordinates;
  });

  return await Promise.all(coordinatesPromises);
}
