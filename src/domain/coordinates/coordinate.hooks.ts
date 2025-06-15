import { container, DI } from "@/lib/di/container";
import { CoordinateService } from "./coordinate.service";

export function getCoordinatesService() {
  return container.get<CoordinateService>(DI.COORDINATE_SERVICE);
}
