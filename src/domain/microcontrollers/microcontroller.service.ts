import { Microcontroller } from "./microcontroller.model";
import { MicrocontrollerRepository } from "./microcontroller.repository";

export class MicrocontrollerService {
  constructor(
    private readonly microcontrollerRepository: MicrocontrollerRepository
  ) {}

  async findMany() {
    return [
      {
        id: "1",
        name: "Microcontroller 1",
        chip: "Chip 1",
        macAddress: "00:00:00:00:00:00",
        model: "Model 1",
        plate: "Plate 1",
        vehicleType: "CAR",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "1",
      },
      {
        id: "2",
        name: "Microcontroller 1",
        chip: "Chip 1",
        macAddress: "00:00:00:00:00:00",
        model: "Model 1",
        plate: "Plate 1",
        vehicleType: "CAR",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "2",
      },
      {
        id: "3",
        name: "Microcontroller 1",
        chip: "Chip 1",
        macAddress: "00:00:00:00:00:00",
        model: "Model 1",
        plate: "Plate 1",
        vehicleType: "CAR",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "3",
      },
    ] as Microcontroller[];
  }
}
