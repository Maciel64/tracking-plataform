export type VehicleType = "CAR" | "MOTORCYCLE" | "TRUCK";

export class Microcontroller {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly chip: string,
    public readonly macAddress: string,
    public readonly model: string,
    public readonly plate: string,
    public readonly vehicleType: VehicleType,
    public readonly active: boolean,
    public readonly userId: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
