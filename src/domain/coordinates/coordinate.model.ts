export class Coordinate {
  constructor(
    public latitude: number,
    public longitude: number,
    public id?: string,
    public microcontrollerId?: string,
    public userId?: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
