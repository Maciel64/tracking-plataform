import { prisma } from "@/providers/prisma/prisma.provider";
import type { User } from "./user.model";

export class UserRepository {
  async create(data: User): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name: data.name || "",
        email: data.email || "",
        password: data.password || "",
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

  async update(id: string, data: User): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
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
