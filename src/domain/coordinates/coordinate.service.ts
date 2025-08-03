import { HttpError, NotFoundError } from "@/lib/errors/http.error";
import { MicrocontrollerRepository } from "../microcontrollers/microcontroller.repository";
import { Coordinate } from "./coordinate.model";
import { CoordinatesRepository } from "./coordinate.repository";
import { CreateCoordinateSchema } from "@/schemas/coordinate.schema";

export class CoordinateService {
  constructor(
    private coordinateRepository: CoordinatesRepository,
    private microcontrollerRepository: MicrocontrollerRepository
  ) {}

  public async create(
    data: CreateCoordinateSchema
  ): Promise<Coordinate | HttpError> {
    const micro = await this.microcontrollerRepository.findById(
      data.microcontrollerId
    );

    if (!micro) {
      return new NotFoundError("Microcontrolador não encontrado");
    }

    return this.coordinateRepository.create({
      latitude: data.latitude,
      longitude: data.longitude,
      microcontrollerId: data.microcontrollerId,
    });
  }

  public async findMany(id: string): Promise<Coordinate[]> {
    return this.coordinateRepository.findMany(id);
  }
}
