/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from "@/@types/user";
import { auth, db, TFirestoreAdapter } from "@/lib/adapters/firebase.adapter";
import { CreateUserSchema, LoginSchema } from "@/schemas/user.schema";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export class UsersRepository {
  private readonly usersCollection;

  constructor(private readonly firebaseAdapter: TFirestoreAdapter) {
    this.usersCollection = this.firebaseAdapter.collection(db, "users");
  }
  async create(data: CreateUserSchema): Promise<User> {
    const { email, name, password } = data;

    const res = await createUserWithEmailAndPassword(auth, email, password);

    const user = {
      email,
      uid: res.user.uid,
      name,
      createdAt: new Date(),
      updatedAt: null,
      role: "USER",
    } as User;

    const userDoc = this.firebaseAdapter.doc(this.usersCollection, user.uid);
    await this.firebaseAdapter.setDoc(userDoc, user);

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const ref = this.firebaseAdapter.doc(this.usersCollection, id);
    const snapshot = await this.firebaseAdapter.getDoc(ref);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as User;
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

  async login(data: LoginSchema) {
    try {
      const { email, password } = data;

      const res = await signInWithEmailAndPassword(auth, email, password);

      const ref = this.firebaseAdapter.doc(db, "users", res.user.uid);
      const snapshot = await this.firebaseAdapter.getDoc(ref);

      if (!snapshot.exists()) {
        return null;
      }

      return {
        email: res.user.email,
        uid: res.user.uid,
        name: snapshot.data()?.name,
        createdAt: snapshot.data()?.createdAt,
        updatedAt: snapshot.data()?.updatedAt,
        role: snapshot.data()?.role,
      } as User;
    } catch {
      return null;
    }
  }
}
