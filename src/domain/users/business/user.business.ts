import type { User, UserEnterprise } from "../user.model";

export class UserBusiness {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  enterprises?: UserEnterprise[];

  constructor(user: Required<User>) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.enterprises = this.enterprises;
  }
}
