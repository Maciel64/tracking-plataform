import { container, DI } from "@/lib/di/container";
import { AdminService } from "./admin.service";

export function getAdminService() {
  return container.get<AdminService>(DI.ADMIN_SERVICE);
}
