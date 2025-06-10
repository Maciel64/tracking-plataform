import { container, DI } from "@/lib/di/container";
import { MicrocontrollerService } from "./microcontroller.service";

export function getMicrocontrollerService() {
  return container.get<MicrocontrollerService>(DI.MICROCONTROLLER_SERVICE);
}
