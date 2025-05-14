// coordinates.repository.ts

import { Microcontroller } from "@/@types/microcontroller";import { Coordinates } from "@/@types/coordinates";

export class CoordinatesRepository {
  private firestore: any;

  constructor(firestoreAdapter: any) {
    this.firestore = firestoreAdapter;
  }

  public async findMicrocontrollerByMac(mac: string): Promise<Microcontroller | null> {
  const microcontrollersRef = this.firestore.collection('microcontrollers');
  const microcontrollerRef = microcontrollersRef.doc(mac);
  const microcontrollerDoc = await microcontrollerRef.get();
  if (microcontrollerDoc.exists) {
    return microcontrollerDoc.data() as Microcontroller;
  } else {
    return null;
  }
}

 public async findUserById(user_id: string): Promise<any> {
  const usersRef = this.firestore.collection('users');
  const userRef = usersRef.doc(user_id);
  const userDoc = await userRef.get();
  if (userDoc.exists) {
    return userDoc.data();
  } else {
    return null;
  }
}

 public async create(coordinate: Coordinates): Promise<Coordinates> {
  const coordinatesRef = this.firestore.collection('coordinates');
  const newCoordinateRef = await coordinatesRef.add(coordinate);
  const newCoordinateDoc = await newCoordinateRef.get();
  return newCoordinateDoc.data() as Coordinates;
}

 public async find(): Promise<Coordinates[]> {
  const coordinatesRef = this.firestore.collection('coordinates');
  const coordinatesDocs = await coordinatesRef.get();
  const coordinates = coordinatesDocs.docs.map((doc: any) => doc.data() as Coordinates);
  return coordinates;
}
}