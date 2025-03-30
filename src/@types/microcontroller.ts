export interface Coordinate {
  uid: string;
  latitude: number;
  longitude: number;
  microcontroller: Microcontroller;
}

export interface Microcontroller {
  uid: string;
  name: string;
  mac_address: string;
  coordinates?: Coordinate[];
}
