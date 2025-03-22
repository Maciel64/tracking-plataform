import { auth } from "@/lib/adapters/firebase.adapter";
import { loginSchema, LoginSchema } from "@/schemas/user.schema";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as LoginSchema;

    loginSchema.parse(data);

    const { email, password } = data;

    const res = await signInWithEmailAndPassword(auth, email, password);

    return Response.json(res);
  } catch (error) {
    if (error instanceof FirebaseError) {
      return Response.json("Email ou senha incorretos", { status: 422 });
    }

    return Response.json((error as Error).message, { status: 400 });
  }
}
