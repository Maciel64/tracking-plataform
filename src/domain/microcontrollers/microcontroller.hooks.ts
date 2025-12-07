import { container, DI } from "@/lib/di/container";
import type { MicrocontrollerService } from "./microcontroller.service";

export function getMicrocontrollerService() {
  return container.get<MicrocontrollerService>(DI.MICROCONTROLLER_SERVICE);
}
