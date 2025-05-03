import { Coordinates } from "./coordinates";

export interface Microcontroller {
  uid: string;
  name: string;
  mac_address: string;
  coordinates?: Coordinates[];
  model: "Raster1" | "Raster2";
  chip: "VIVO" | "CLARO" | "TIM";
  plate: string;
  type: "CAR" | "BIKE" | "TRUCK";
  active: boolean;
}
