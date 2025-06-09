/* eslint-disable @typescript-eslint/no-unused-vars */
import { User, UserRoles, UserStatus } from "./user.model";
import { CreateUserSchema, LoginSchema } from "@/schemas/user.schema";
import { prisma } from "@/providers/prisma/prisma.provider";
import { UserRole, UserStatus as PrismaUserStatus } from "@/generated/prisma";

export class UserRepository {
  async create(data: User): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password!,
        role: data.role,
        status: data.status,
      },
    });

    return user;
  }

  async findMany(): Promise<User[]> {
    const users = await prisma.user.findMany();

    return users;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async update(id: string, updateUserSchema: User): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: updateUserSchema.name,
        email: updateUserSchema.email,
        role: updateUserSchema.role as unknown as UserRole,
        status: PrismaUserStatus.ENABLED,
      },
    });

    return user;
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}
