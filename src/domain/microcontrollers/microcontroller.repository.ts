import { prisma } from "@/providers/prisma/prisma.provider";
import { Microcontroller } from "./microcontroller.model";

export class MicrocontrollerRepository {
  findMany() {
    return prisma.microcontroller.findMany();
  }

  findManyByUserId(userId: string) {
    return prisma.microcontroller.findMany({
      where: {
        userId,
      },
    });
  }

  findByMacAddress(macAddress: string) {
    return prisma.microcontroller.findFirst({
      where: {
        macAddress,
      },
    });
  }

  findByPlate(plate: string) {
    return prisma.microcontroller.findFirst({
      where: {
        plate,
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
