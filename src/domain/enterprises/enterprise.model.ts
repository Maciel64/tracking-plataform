import type {
  UserEnterprise,
  UserRoles,
  UserStatus,
} from "../users/user.model";

export class Enterprise {
  id?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  users?: UserEnterprise[];

  constructor(enterprise: Enterprise) {
    this.name = enterprise.name;
  }
}

export class EnterpriseDTO {
  id?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  role?: UserRoles;
  status?: UserStatus;

  static toJson(data: Enterprise): EnterpriseDTO {
    return {
      id: data.id,
      createdAt: data.createdAt,
      deletedAt: data.deletedAt,
      name: data.name,
      role: data.users?.[0]?.role,
      status: data.users?.[0]?.status,
      updatedAt: data.updatedAt,
    };
  }
}
