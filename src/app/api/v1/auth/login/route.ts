import { auth } from "@/lib/adapters/firebase.adapter";
import { registerSchema, RegisterSchema } from "@/schemas/user.schema";
import { signInWithEmailAndPassword } from "firebase/auth";

export async function POST(request: Request) {
  const data = (await request.json()) as RegisterSchema;

  registerSchema.parse(data);

  const { email, password } = data;

  const res = await signInWithEmailAndPassword(auth, email, password);

  return Response.json(res);
}
