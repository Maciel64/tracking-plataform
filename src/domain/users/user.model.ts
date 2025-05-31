export enum UserRoles {
  USER = "USER",
  ADMIN = "ADMIN",
}

export class User {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: UserRoles;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: User) {
    this.id = data.id;
    this.uid = data.uid;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
  }
}
