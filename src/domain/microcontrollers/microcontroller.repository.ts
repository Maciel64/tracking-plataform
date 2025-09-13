import { prisma } from "@/providers/prisma/prisma.provider";
import { Microcontroller } from "./microcontroller.model";

export class MicrocontrollerRepository {
  findMany() {
    return prisma.microcontroller.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  findManyByUserId(userId: string) {
    return prisma.microcontroller.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });
  }

  findByMacAddress(macAddress: string) {
    return prisma.microcontroller.findFirst({
      where: {
        macAddress,
        deletedAt: null,
      },
    });
  }

  findByPlate(plate: string) {
    return prisma.microcontroller.findFirst({
      where: {
        plate,
        deletedAt: null,
      },
    });
  }

  findById(id: string) {
    return prisma.microcontroller.findUnique({
      where: {
        id,
      },
    });
  }

  create(data: Microcontroller) {
    return prisma.microcontroller.create({
      data: {
        name: data.name,
        chip: data.chip,
        macAddress: data.macAddress,
        model: data.model,
        plate: data.plate,
        vehicleType: data.vehicleType,
        active: true,
        userId: data.userId,
      },
    });
  }

  update(id: string, data: Partial<Microcontroller>) {
    return prisma.microcontroller.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        chip: data.chip,
        macAddress: data.macAddress,
        model: data.model,
        plate: data.plate,
        vehicleType: data.vehicleType,
        active: data.active,
        deletedAt: data.deletedAt,
      },
    });
  }

  delete(id: string) {
    return prisma.microcontroller.delete({
      where: {
        id,
      },
    });
  }

  getWithLatestCoordinates() {
    return prisma.microcontroller.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        coordinates: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }

  getWithLatestCoordinatesByUser(userId: string) {
    return prisma.microcontroller.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        coordinates: {
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }

  getOneWithLatestCoordinates(id: string) {
    return prisma.microcontroller.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        coordinates: {
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }
}
