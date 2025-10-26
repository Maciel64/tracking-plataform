import { Crypto } from "@/lib/crypto";
import {
  ConflictError,
  type HttpError,
  NotFoundError,
} from "@/lib/errors/http.error";
import type { AdminCreatesUserSchema } from "@/schemas/user.schema";
import { UserResponseDTO } from "../users/user.model";
import type { UserRepository } from "../users/user.repository";

export class AdminService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(
    data: AdminCreatesUserSchema,
  ): Promise<UserResponseDTO | HttpError> {
    const user = await this.userRepository.findByEmail(data.email);

    if (user) {
      return new ConflictError("Usuário já existe");
    }

    const password = await Crypto.encrypt(
      "rastcom-password",
      process.env.DATABASE_CRYPTO_PASSWORD as string,
    );

    const createdUser = await this.userRepository.create({
      id: "",
      password,
      email: data.email,
      name: data.name,
    });

    return UserResponseDTO.toJSON(createdUser);
  }

  async updateUser(
    userId: string,
    data: AdminCreatesUserSchema,
  ): Promise<UserResponseDTO | HttpError> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return new NotFoundError("Usuário não encontrado");
    }

    const emailAlreadyExists = await this.userRepository.findByEmail(
      data.email,
    );

    if (emailAlreadyExists && emailAlreadyExists.id !== userId) {
      return new ConflictError("Email já está em uso");
    }

    const updatedUser = await this.userRepository.update(user.id || "", {
      id: user.id,
      password: user.password,
      name: data.name,
      email: data.email,
    });

    return UserResponseDTO.toJSON(updatedUser);
  }

  async deleteUser(id: string): Promise<undefined | HttpError> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return new NotFoundError("Usuário não encontrado");
    }

    await this.userRepository.delete(id);
  }
}
