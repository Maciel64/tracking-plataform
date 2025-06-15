export class Coordinate {
  constructor(
    public latitude: number,
    public longitude: number,
    public microcontrollerId?: string,
    public userId?: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
