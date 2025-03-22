import { UsersRepository } from "@/domain/users/users.repository";
import { UsersService } from "@/domain/users/users.service";
import { firestoreAdapter } from "@/lib/adapters/firebase.adapter";
import { NextResponse } from "next/server";

const usersRepository = new UsersRepository(firestoreAdapter);
const usersService = new UsersService(usersRepository);

export async function GET() {
  const users = await usersService.find();

  return NextResponse.json(users);
}
