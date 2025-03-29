import { User } from "@/@types/user";
import { UsersRepository } from "./users.repository";
import {
  createUserSchema,
  CreateUserSchema,
  loginSchema,
  LoginSchema,
} from "@/schemas/user.schema";

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async find(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async create(data: CreateUserSchema): Promise<User> {
    createUserSchema.parse(data);

    return this.usersRepository.create(data);
  }

  async update(id: string, user: User): Promise<User> {
    return this.usersRepository.update(id, user);
  }

  async delete(id: string): Promise<void> {
    return this.usersRepository.delete(id);
  }

  async login(data: LoginSchema) {
    loginSchema.parse(data);

    return this.usersRepository.login(data);
  }
}
