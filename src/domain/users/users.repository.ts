/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from "@/@types/user";
import { CreateUserSchema, LoginSchema } from "@/schemas/user.schema";
import { prisma } from "@/providers/prisma/prisma.provider";

export class UsersRepository {
  async create(data: CreateUserSchema): Promise<User> {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: "USER",
        status: "ENABLED",
      },
    });
  }

  async find(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateUserSchema: User): Promise<User> {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name: updateUserSchema.name,
        email: updateUserSchema.email,
        role: updateUserSchema.role,
        status: updateUserSchema.status,
      },
    });

    return user;
  }

  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async login(data: LoginSchema): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
}
