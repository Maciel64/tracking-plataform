import { UsersRepository } from "@/domain/users/users.repository";
import { UsersService } from "@/domain/users/users.service";
import { createContainer } from "@evyweb/ioctopus";

export const DI = {
  USER_SERVICE: Symbol("USER_SERVICE"),
  USER_REPOSITORY: Symbol("USER_REPOSITORY"),
};

export const container = createContainer();

container.bind(DI.USER_REPOSITORY).toClass(UsersRepository);
container
  .bind(DI.USER_SERVICE)
  .toClass(UsersService, { usersRepository: DI.USER_REPOSITORY });
