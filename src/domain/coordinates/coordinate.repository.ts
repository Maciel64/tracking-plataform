import { prisma } from "@/providers/prisma/prisma.provider";
import { Coordinate } from "./coordinate.model";

export class CoordinatesRepository {
  public async create(coordinate: Coordinate): Promise<Coordinate> {
    return prisma.coordinate.create({
      data: {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        microcontrollerId: coordinate.microcontrollerId!,
      },
    });
  }

  public async findMany(id: string): Promise<Coordinate[]> {
    return prisma.coordinate.findMany({
      where: {
        id,
      },
    });
  }
}
