import { UserRepository } from "@/domain/users/user.repository";
import { UserService } from "@/domain/users/user.service";
import { createContainer } from "@evyweb/ioctopus";

export const DI = {
  USER_SERVICE: Symbol("USER_SERVICE"),
  USER_REPOSITORY: Symbol("USER_REPOSITORY"),
};

export const container = createContainer();

container.bind(DI.USER_REPOSITORY).toClass(UserRepository);
container.bind(DI.USER_SERVICE).toClass(UserService, [DI.USER_REPOSITORY]);
