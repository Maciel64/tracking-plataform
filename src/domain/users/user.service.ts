import { Crypto } from "@/lib/crypto";
import {
  ConflictError,
  HttpError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/errors/http.error";
import {
  type CreateUserSchema,
  createUserSchema,
  type LoginSchema,
  loginSchema,
} from "@/schemas/user.schema";
import type { EnterpriseService } from "../enterprises/enterprise.service";
import { type User, UserAuthDTO, UserResponseDTO } from "./user.model";
import type { UserRepository } from "./user.repository";

export class UserService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly enterpriseService: EnterpriseService,
  ) {}

  async findById(id: string): Promise<UserResponseDTO | HttpError> {
    const user = await this.usersRepository.findById(id);

    if (!user) return new NotFoundError("User not found");

    return UserResponseDTO.toJSON(user);
  }

  async findMany(): Promise<UserResponseDTO[]> {
    const users = await this.usersRepository.findMany();

    return users.map((user) => UserResponseDTO.toJSON(user));
  }

  async create(data: CreateUserSchema): Promise<UserAuthDTO | HttpError> {
    createUserSchema.parse(data);

    const userExists = await this.usersRepository.findByEmail(data.email);

    if (userExists) {
      return new ConflictError(
        "Esse email já está em uso. Faça login para continuar",
      );
    }

    const enterpriseExists = await this.enterpriseService.findByName(
      data.enterpriseName,
    );

    if (enterpriseExists) {
      return new ConflictError(
        "Essa empresa já está cadastrada. Faça login ou peça para que convidem você para fazer parte.",
      );
    }

    const encryptedPassword = await Crypto.encrypt(
      data.password,
      process.env.DATABASE_CRYPTO_PASSWORD as string,
    );

    const user = await this.usersRepository.create({
      email: data.email,
      password: encryptedPassword,
      name: data.name,
    });

    if (!user.id) return new HttpError(500, "Server error");

    const enterprise = await this.enterpriseService.create({
      name: data.enterpriseName,
      role: "OWNER",
      status: "ENABLED",
      userId: user.id,
    });

    return UserAuthDTO.toJSON(user, [enterprise]);
  }

  async update(id: string, user: User): Promise<UserResponseDTO | HttpError> {
    const userExists = await this.usersRepository.findById(id);

    if (!userExists) return new NotFoundError("User not found");

    const updatedUser = await this.usersRepository.update(id, user);

    return UserResponseDTO.toJSON(updatedUser);
  }

  async delete(id: string): Promise<void> {
    return this.usersRepository.delete(id);
  }

  async login(data: LoginSchema): Promise<UserAuthDTO | HttpError> {
    loginSchema.parse(data);

    const user = await this.usersRepository.findByEmail(data.email);

    if (!user) {
      return new UnauthorizedError("Email ou senha inválidos");
    }

    const decryptedPassword = await Crypto.decrypt(
      user.password || "",
      process.env.DATABASE_CRYPTO_PASSWORD as string,
    );

    if (data?.password !== decryptedPassword) {
      return new UnauthorizedError("Email ou senha inválidos");
    }

    const enterprises = await this.enterpriseService.findByUserId(
      user.id || "",
    );

    return UserAuthDTO.toJSON(user, enterprises);
  }
}
