import { UserRepository } from "./user.repository";
import {
  createUserSchema,
  CreateUserSchema,
  loginSchema,
  LoginSchema,
} from "@/schemas/user.schema";
import { ConflictError, UnauthorizedError } from "@/lib/errors/http.error";
import { User, UserResponseDTO } from "./user.model";

export class UserService {
  constructor(private readonly usersRepository: UserRepository) {}

  async findById(id: string): Promise<UserResponseDTO | null> {
    return this.usersRepository.findById(id);
  }

  async create(data: CreateUserSchema): Promise<UserResponseDTO> {
    createUserSchema.parse(data);

    const userExists = await this.usersRepository.findByEmail(data.email);

    if (userExists) {
      throw new ConflictError(
        "Esse email já está em uso. Faça login para continuar"
      );
    }

    const user = await this.usersRepository.create(data);

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

    if (!user || user?.password !== data.password) {
      throw new UnauthorizedError("Email ou senha inválidos");
    }

    return user;
  }
}
