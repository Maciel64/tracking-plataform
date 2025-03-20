import { Coordinates } from "@/@types/coordinates";
import { db, TFirestoreAdapter } from "@/libs/adapters/firebase.adapter";

export class CoordinatesRepository implements ICoodinatesRepository {
  private readonly coordinatesCollection;

  constructor(private readonly firebaseAdapter: TFirestoreAdapter) {
    this.coordinatesCollection = this.firebaseAdapter.collection(
      db,
      "coordinates"
    );
  }

  public async create(coordinate: Coordinates): Promise<Coordinates> {
    const docRef = await this.firebaseAdapter.addDoc(
      this.coordinatesCollection,
      coordinate
    );
    return { ...coordinate, uid: docRef.id };
  }

  public async find(): Promise<Coordinates[]> {
    const coordinates = await this.firebaseAdapter.getDocs(
      this.coordinatesCollection
    );
    return coordinates.docs.map(
      (doc) => ({ uid: doc.id, ...doc.data() } as Coordinates)
    );
  }
}

export interface ICoodinatesRepository {
  create(data: Coordinates): Promise<Coordinates>;
  find(): Promise<Coordinates[]>;
}
