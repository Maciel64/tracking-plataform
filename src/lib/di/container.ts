import { AdminService } from "@/domain/admin/admin.service";
import { MicrocontrollerRepository } from "@/domain/microcontrollers/microcontroller.repository";
import { MicrocontrollerService } from "@/domain/microcontrollers/microcontroller.service";
import { UserRepository } from "@/domain/users/user.repository";
import { UserService } from "@/domain/users/user.service";
import { createContainer } from "@evyweb/ioctopus";

export const DI = {
  USER_SERVICE: Symbol("USER_SERVICE"),
  USER_REPOSITORY: Symbol("USER_REPOSITORY"),
  ADMIN_SERVICE: Symbol("ADMIN_SERVICE"),
  MICROCONTROLLER_REPOSITORY: Symbol("MICROCONTROLLER_REPOSITORY"),
  MICROCONTROLLER_SERVICE: Symbol("MICROCONTROLLER_SERVICE"),
};

export const container = createContainer();

container.bind(DI.USER_REPOSITORY).toClass(UserRepository);
container.bind(DI.USER_SERVICE).toClass(UserService, [DI.USER_REPOSITORY]);

container
  .bind(DI.MICROCONTROLLER_REPOSITORY)
  .toClass(MicrocontrollerRepository);
container
  .bind(DI.MICROCONTROLLER_SERVICE)
  .toClass(MicrocontrollerService, [
    DI.MICROCONTROLLER_REPOSITORY,
    DI.USER_REPOSITORY,
  ]);

container.bind(DI.ADMIN_SERVICE).toClass(AdminService, [DI.USER_REPOSITORY]);
