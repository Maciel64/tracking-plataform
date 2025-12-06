import { NotFoundError } from "@/lib/errors/http.error";
import type {
  AddUserSchema,
  CreateEnterpriseSchema,
} from "@/schemas/enterprise.schema";
import type { UserRepository } from "../users/user.repository";
import { Enterprise } from "./enterprise.model";
import type { EnterpriseRepository } from "./enterprise.repository";

export class EnterpriseService {
  constructor(
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(data: CreateEnterpriseSchema) {
    const existis = await this.enterpriseRepository.findByName(data.name);

    if (existis) {
      throw new Error("Empresa já existe");
    }

    const enterprise = new Enterprise({
      name: data.name,
    });

    return this.enterpriseRepository.create({
      ...enterprise,
      role: data.role,
      userId: data.userId,
      status: data.status,
    });
  }

  async find(id: string) {
    return this.enterpriseRepository.find(id);
  }

  async findByName(name: string) {
    return this.enterpriseRepository.findByName(name);
  }

  async findByUserId(userId: string) {
    return this.enterpriseRepository.findByUserId(userId);
  }

  async addUser(data: AddUserSchema) {
    const exists = await this.enterpriseRepository.find(data.enterpriseId);

    if (!exists) {
      return new NotFoundError("Empresa não encontrada");
    }

    const user = await this.userRepository.findById(data.userId);

    if (!user) {
      return new NotFoundError("Usuário não encontrado");
    }

    await this.enterpriseRepository.addUser({
      enterpriseId: data.enterpriseId,
      role: data.role,
      userId: data.userId,
      status: data.status,
    });
  }
}
