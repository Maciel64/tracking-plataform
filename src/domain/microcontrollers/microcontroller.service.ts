import {
  ConflictError,
  ForbiddenError,
  type HttpError,
  NotFoundError,
} from "@/lib/errors/http.error";
import type {
  CreateMicrocontrollerSchema,
  UpdateMicrocontrollerSchema,
} from "@/schemas/microcontroller.schema";
import type { UserRepository } from "../users/user.repository";
import type { Microcontroller } from "./microcontroller.model";
import type { MicrocontrollerRepository } from "./microcontroller.repository";

export class MicrocontrollerService {
  constructor(
    private readonly microcontrollerRepository: MicrocontrollerRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async findMany() {
    return this.microcontrollerRepository.findMany();
  }

  async findManyByUserId(userId: string, enterpriseId?: string) {
    return this.microcontrollerRepository.findManyByUserId(
      userId,
      enterpriseId,
    );
  }

  async findById(id: string) {
    const microcontroller = await this.microcontrollerRepository.findById(id);

    if (!microcontroller) {
      return new NotFoundError("Microcontrolador não encontrado");
    }

    return microcontroller;
  }

  async findByMacAddress(macAddress: string) {
    const microcontroller =
      await this.microcontrollerRepository.findByMacAddress(macAddress);

    if (!microcontroller) {
      return new NotFoundError("Microcontrolador não encontrado");
    }

    return microcontroller;
  }

  async create(
    userId: string,
    data: CreateMicrocontrollerSchema,
  ): Promise<Microcontroller | HttpError> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return new NotFoundError("Usuário não encontrado");
    }

    const macAddressExists =
      await this.microcontrollerRepository.findByMacAddress(data.macAddress);

    if (macAddressExists) {
      return new ConflictError(
        "Já existe um microcontrolador com esse MAC Address",
      );
    }

    const plateExists = await this.microcontrollerRepository.findByPlate(
      data.plate,
    );

    if (plateExists) {
      return new ConflictError("Já existe um microcontrolador com essa placa");
    }

    return this.microcontrollerRepository.create({
      id: "",
      userId,
      ...data,
    });
  }

  async update(
    userId: string,
    enterpriseId: string,
    id: string,
    data: UpdateMicrocontrollerSchema,
  ): Promise<Microcontroller | HttpError> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return new NotFoundError("Usuário não encontrado");
    }

    const microcontroller = await this.microcontrollerRepository.findById(id);

    if (!microcontroller) {
      return new NotFoundError("Microcontrolador não encontrado");
    }

    if (
      !(
        user.enterprises?.find((e) => e.id === enterpriseId)?.role === "ADMIN"
      ) &&
      microcontroller.userId !== userId
    ) {
      return new ForbiddenError(
        "Você não tem permissão para atualizar este microcontrolador",
      );
    }

    if (data.macAddress) {
      const macAddressExists =
        await this.microcontrollerRepository.findByMacAddress(data.macAddress);

      if (macAddressExists && macAddressExists.id !== id) {
        return new ConflictError(
          "Já existe um microcontrolador com esse MAC Address",
        );
      }
    }

    if (data.plate) {
      const plateExists = await this.microcontrollerRepository.findByPlate(
        data.plate,
      );

      if (plateExists && plateExists.id !== id) {
        return new ConflictError(
          "Já existe um microcontrolador com essa placa",
        );
      }
    }

    return this.microcontrollerRepository.update(id, data);
  }

  async delete(userId: string, id: string): Promise<undefined | HttpError> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return new NotFoundError("Usuário não encontrado");
    }

    const microcontroller = await this.microcontrollerRepository.findById(id);

    if (!microcontroller) {
      return new NotFoundError("Microcontrolador não encontrado");
    }

    if (microcontroller.userId !== userId) {
      return new ForbiddenError(
        "Você não tem permissão para apagar este microcontrolador",
      );
    }

    await this.microcontrollerRepository.update(id, {
      active: false,
      deletedAt: new Date(),
    });
  }

  async getWithLatestCoordinates(): Promise<Microcontroller[]> {
    return this.microcontrollerRepository.getWithLatestCoordinates();
  }

  async getWithLatestCoordinatesByUser(
    userId: string,
  ): Promise<Microcontroller[]> {
    return this.microcontrollerRepository.getWithLatestCoordinatesByUser(
      userId,
    );
  }

  async getOneWithLatestCoordinates(
    id: string,
  ): Promise<Microcontroller | HttpError> {
    const microcontroller =
      await this.microcontrollerRepository.getOneWithLatestCoordinates(id);

    if (!microcontroller) {
      return new NotFoundError("Microcontrolador não encontrado");
    }

    return microcontroller;
  }
}
