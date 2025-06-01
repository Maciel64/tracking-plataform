import { container, DI } from "@/lib/di/container";
import { UserService } from "./user.service";

export function getUserService() {
  return container.get<UserService>(DI.USER_SERVICE);
}
