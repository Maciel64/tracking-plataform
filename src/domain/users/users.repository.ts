/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from "@/@types/user";
import { db, TFirestoreAdapter } from "@/libs/adapters/firebase.adapter";

export class UsersRepository implements IUsersRepository {
  private readonly usersCollection;

  constructor(private readonly firebaseAdapter: TFirestoreAdapter) {
    this.usersCollection = this.firebaseAdapter.collection(db, "users");
  }
  create(user: User): Promise<User> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  update(id: string, user: User): Promise<User> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async find() {
    const snapshot = await this.firebaseAdapter.getDocs(this.usersCollection);
    return snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() } as User));
  }
}

export interface IUsersRepository {
  create(user: User): Promise<User>;
  find(): Promise<User[]>;
  findById(id: string): Promise<User>;
  update(id: string, user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
