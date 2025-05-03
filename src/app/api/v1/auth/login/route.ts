import { loginSchema, LoginSchema } from "@/schemas/user.schema";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as LoginSchema;
    loginSchema.parse(data);

    return Response.json(
      { error: "Faça o login no frontend usando o Firebase Auth Client SDK." },
      { status: 400 }
    );
  } catch (error) {
    return Response.json((error as Error).message, { status: 400 });
  }
}
