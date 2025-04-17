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

  // Método de exclusão de usuário
  async delete(id: string): Promise<void> {
    try {
      // Chama o método de exclusão no repositório
      await this.usersRepository.delete(id);
      console.log('Usuário deletado com sucesso');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      throw new Error('Não foi possível excluir o usuário.');
    }
  }

  async login(data: LoginSchema) {
    loginSchema.parse(data);
    console.log('Tentando login com:', data);

    return this.usersRepository.login(data);
  }
}
