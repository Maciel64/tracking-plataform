import { AdminCreatesUserSchema } from "@/schemas/user.schema";
import { UserRepository } from "../users/user.repository";
import {
  ConflictError,
  HttpError,
  NotFoundError,
} from "@/lib/errors/http.error";
import { Crypto } from "@/lib/crypto";
import { UserResponseDTO } from "../users/user.model";

export class AdminService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(
    data: AdminCreatesUserSchema
  ): Promise<UserResponseDTO | HttpError> {
    const user = await this.userRepository.findByEmail(data.email);

    if (user) {
      return new ConflictError("Usuário já existe");
    }

    const password = await Crypto.encrypt(
      "raster-password",
      process.env.DATABASE_CRYPTO_PASSWORD as string
    );

    return this.userRepository.create({
      id: "",
      password,
      email: data.email,
      name: data.name,
      role: data.role,
      status: data.status,
    });
  }

  async updateUser(
    userId: string,
    data: AdminCreatesUserSchema
  ): Promise<UserResponseDTO | HttpError> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return new NotFoundError("Usuário não encontrado");
    }

    const emailAlreadyExists = await this.userRepository.findByEmail(
      data.email
    );

    if (emailAlreadyExists && emailAlreadyExists.id !== userId) {
      return new ConflictError("Email já está em uso");
    }

    return this.userRepository.update(user.id, {
      id: user.id,
      password: user.password,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
    });
  }

  async deleteUser(id: string): Promise<void | HttpError> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return new NotFoundError("Usuário não encontrado");
    }

    await this.userRepository.delete(id);
  }
}
