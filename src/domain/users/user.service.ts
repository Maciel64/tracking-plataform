import { UserRepository } from "./user.repository";
import {
  createUserSchema,
  CreateUserSchema,
  loginSchema,
  LoginSchema,
} from "@/schemas/user.schema";
import { ConflictError, UnauthorizedError } from "@/lib/errors/http.error";
import { User, UserResponseDTO } from "./user.model";
import { Crypto } from "@/lib/crypto";

export class UserService {
  constructor(private readonly usersRepository: UserRepository) {}

  async findById(id: string): Promise<UserResponseDTO | null> {
    return this.usersRepository.findById(id);
  }

  async findMany(): Promise<UserResponseDTO[]> {
    const users = await this.usersRepository.findMany();

    return users.map((user) => UserResponseDTO.toJSON(user));
  }

  async create(data: CreateUserSchema): Promise<UserResponseDTO> {
    createUserSchema.parse(data);

    const userExists = await this.usersRepository.findByEmail(data.email);

    if (userExists) {
      throw new ConflictError(
        "Esse email já está em uso. Faça login para continuar"
      );
    }

    const encryptedPassword = await Crypto.encrypt(
      data.password,
      process.env.PASSWORD_SECRET as string
    );

    const user = await this.usersRepository.create({
      ...data,
      password: encryptedPassword,
    });

    return UserResponseDTO.toJSON(user);
  }

  async update(id: string, user: User): Promise<UserResponseDTO> {
    return this.usersRepository.update(id, user);
  }

  async delete(id: string): Promise<void> {
    return this.usersRepository.delete(id);
  }

  async login(data: LoginSchema): Promise<UserResponseDTO> {
    loginSchema.parse(data);

    const user = await this.usersRepository.findByEmail(data.email);

    const decryptedPassword = await Crypto.decrypt(
      user?.password || "",
      process.env.PASSWORD_SECRET as string
    );

    if (!user || data?.password !== decryptedPassword) {
      throw new UnauthorizedError("Email ou senha inválidos");
    }

    return user;
  }
}
