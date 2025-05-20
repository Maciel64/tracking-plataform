import { Coordinate } from "@/@types/coordinates";
import { CoordinatesRepository } from "./coordinates.repository";

export class CoordinatesService implements ICoordinatesService {
  constructor(private repository: CoordinatesRepository) {}

  public async create(data: Coordinate): Promise<Coordinate> {
    return this.repository.create(data);
  }

  public async find(): Promise<Coordinate[]> {
    return this.repository.find();
  }
}

export interface ICoordinatesService {
  create(data: Coordinate): Promise<Coordinate>;
  find(): Promise<Coordinate[]>;
}
