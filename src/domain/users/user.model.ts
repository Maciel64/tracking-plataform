import { Microcontroller } from "@/@types/microcontroller";

export type UserRoles = "USER" | "ADMIN";

export type UserStatus = "ENABLED" | "DISABLED";

export class User {
  id: string;
  name: string;
  email: string;
  role: UserRoles = "USER";
  status: UserStatus = "ENABLED";
  createdAt?: Date;
  updatedAt?: Date;
  password?: string;
  microcontrollers?: Microcontroller[];

  constructor(data: User) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
    this.password = data.password;
  }
}

export class UserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: UserRoles;

  constructor(data: User | null) {
    if (!data) {
      throw new Error("User not found");
    }

    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
  }

  static toJSON(user: User): UserResponseDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
