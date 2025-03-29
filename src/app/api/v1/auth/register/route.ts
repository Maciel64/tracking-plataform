import { UsersRepository } from "@/domain/users/users.repository";
import { UsersService } from "@/domain/users/users.service";
import { firestoreAdapter } from "@/lib/adapters/firebase.adapter";
import { CreateUserSchema } from "@/schemas/user.schema";

const usersRepository = new UsersRepository(firestoreAdapter);
const usersService = new UsersService(usersRepository);

export async function POST(request: Request) {
  const data = (await request.json()) as CreateUserSchema;

  const res = await usersService.create(data);

  return Response.json(res);
}
