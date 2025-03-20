import { User } from "@/@types/user";
import { IUsersRepository } from "./users.repository";

export class UsersService implements IUsersService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async find(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(id: string): Promise<User> {
    return this.usersRepository.findById(id);
  }

  async create(user: User): Promise<User> {
    return this.usersRepository.create(user);
  }

  async update(id: string, user: User): Promise<User> {
    return this.usersRepository.update(id, user);
  }

  async delete(id: string): Promise<void> {
    return this.usersRepository.delete(id);
  }
}

export interface IUsersService {
  find(): Promise<User[]>;
  findById(id: string): Promise<User>;
  create(user: User): Promise<User>;
  update(id: string, user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
