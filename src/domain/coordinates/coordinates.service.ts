import { Coordinates } from "@/@types/coordinates";
import { CoordinatesRepository } from "./coordinates.repository";

export class CoordinatesService implements ICoodinatesService {
  constructor(private repository: CoordinatesRepository) {}

  public async create(data: Coordinates): Promise<Coordinates> {
    return this.repository.create(data);
  }

  public async find(): Promise<Coordinates[]> {
    return this.repository.find();
  }
}

export interface ICoodinatesService {
  create(data: Coordinates): Promise<Coordinates>;
  find(): Promise<Coordinates[]>;
}
