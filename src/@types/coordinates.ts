import { Key } from "react";

export interface Coordinate {
  uid: Key | null | undefined;
   id?: string;
  microcontroller_uid: string;
  user_id: string;
  latitude: number;
  longitude: number;
  created_at: Date; // Adicione essa linha
}