import { MicrocontrollerSchema } from "@/schemas/microcontroller.schema";
import { MicrocontrollerRepository } from "./microcontroller.repository";
import { UserRepository } from "../users/user.repository";
import {
  ConflictError,
  ForbiddenError,
  HttpError,
  NotFoundError,
} from "@/lib/errors/http.error";
import { Microcontroller } from "./microcontroller.model";

export class MicrocontrollerService {
  constructor(
    private readonly microcontrollerRepository: MicrocontrollerRepository,
    private readonly userRepository: UserRepository
  ) {}

  async findMany() {
    return this.microcontrollerRepository.findMany();
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
    data: MicrocontrollerSchema
  ): Promise<Microcontroller | HttpError> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return new NotFoundError("Usuário não encontrado");
    }

    const macAddressExists =
      await this.microcontrollerRepository.findByMacAddress(data.macAddress);

    if (macAddressExists) {
      return new ConflictError(
        "Já existe um microcontrolador com esse MAC Address"
      );
    }

    const plateExists = await this.microcontrollerRepository.findByPlate(
      data.plate
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
    id: string,
    data: MicrocontrollerSchema
  ): Promise<Microcontroller | HttpError> {
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
        "Você não tem permissão para atualizar este microcontrolador"
      );
    }

    const macAddressExists =
      await this.microcontrollerRepository.findByMacAddress(data.macAddress);

    if (macAddressExists && macAddressExists.id !== id) {
      return new ConflictError(
        "Já existe um microcontrolador com esse MAC Address"
      );
    }

    const plateExists = await this.microcontrollerRepository.findByPlate(
      data.plate
    );

    if (plateExists && plateExists.id !== id) {
      return new ConflictError("Já existe um microcontrolador com essa placa");
    }

    return this.microcontrollerRepository.update(id, data);
  }

  async delete(userId: string, id: string): Promise<void | HttpError> {
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
        "Você não tem permissão para apagar este microcontrolador"
      );
    }

    await this.microcontrollerRepository.delete(id);
  }

  async getWithLatestCoordinates(): Promise<Microcontroller[]> {
    return this.microcontrollerRepository.getWithLatestCoordinates();
  }

  async getOneWithLatestCoordinates(
    id: string
  ): Promise<Microcontroller | HttpError> {
    const microcontroller =
      await this.microcontrollerRepository.getOneWithLatestCoordinates(id);

    if (!microcontroller) {
      return new NotFoundError("Microcontrolador não encontrado");
    }

    return microcontroller;
  }
}
