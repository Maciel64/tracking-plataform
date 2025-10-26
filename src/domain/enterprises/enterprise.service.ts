import type { CreateEnterpriseSchema } from "@/schemas/enterprise.schema";
import { Enterprise } from "./enterprise.model";
import type { EnterpriseRepository } from "./enterprise.repository";

export class EnterpriseService {
  constructor(private readonly enterpriseRepository: EnterpriseRepository) {}

  async create(data: CreateEnterpriseSchema) {
    const existis = await this.enterpriseRepository.findByName(data.name);

    if (existis) {
      throw new Error("Enterprise with this name already exists");
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

  async findByName(name: string) {
    return this.enterpriseRepository.findByName(name);
  }

  async findByUserId(userId: string) {
    return this.enterpriseRepository.findByUserId(userId);
  }
}
