import {
  type Enterprise,
  EnterpriseDTO,
} from "../enterprises/enterprise.model";
import type { Microcontroller } from "../microcontrollers/microcontroller.model";

export const userRoles = ["USER", "ADMIN", "OWNER"] as const;
export type UserRoles = (typeof userRoles)[number];

export const userStatus = ["ENABLED", "DISABLED"] as const;
export type UserStatus = (typeof userStatus)[number];

export class User {
  id?: string;
  name?: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
  password?: string;
  microcontrollers?: Microcontroller[];
  enterprises?: UserEnterprise[];

  constructor(data: User) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
  }
}

export class UserEnterprise {
  id?: string;
  status: UserStatus;
  role: UserRoles;
  userId?: string;
  enterpriseId?: string;
  enterprise?: Enterprise;

  constructor(data: UserEnterprise) {
    this.id = data.id;
    this.userId = data.userId;
    this.enterpriseId = data.enterpriseId;
    this.status = data.status;
    this.role = data.role;
  }
}

export class UserAuthDTO {
  id: string;
  name: string;
  email: string;
  activeEnterprise?: Enterprise;
  enterprises?: Enterprise[];

  constructor(data: User | null) {
    if (!data) {
      throw new Error("User not found");
    }

    this.id = data.id || "";
    this.name = data.name || "";
    this.email = data.email || "";
  }

  static toJSON(
    user: User,
    enterprises?: Enterprise[],
    activeEnterprise?: Enterprise,
  ): UserAuthDTO {
    return {
      id: user.id || "",
      name: user.name || "",
      email: user.email || "",
      enterprises: enterprises?.map((e) => EnterpriseDTO.toJson(e)) || [],
      activeEnterprise:
        activeEnterprise ||
        (enterprises && EnterpriseDTO.toJson(enterprises[0])),
    };
  }
}

export class UserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: UserRoles;
  status: UserStatus;

  constructor(user: User, enterprise: EnterpriseDTO) {
    this.id = user.id || "";
    this.name = user.name || "";
    this.email = user.email || "";
    this.status = enterprise.status || "ENABLED";
    this.role = enterprise.role || "USER";
  }

  static toJSON(user: User, enterprise?: EnterpriseDTO): UserResponseDTO {
    return {
      id: user.id || "",
      name: user.name || "",
      email: user.email || "",
      role: enterprise?.role || user?.enterprises?.[0]?.role || "USER",
      status: enterprise?.status || user?.enterprises?.[0]?.status || "ENABLED",
    };
  }
}
