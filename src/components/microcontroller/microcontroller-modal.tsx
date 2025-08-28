"use client";

import { CheckCircle, Cpu, MapPin, XCircle } from "lucide-react";
import { DialogContent, Dialog, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Microcontroller } from "@/domain/microcontrollers/microcontroller.model";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Map from "../map";
import { MicrocontrollerDetailsModalCard } from "./modal-card/microcontroller-details-modal-card";
import { MicrocontrollerVeichleModalCard } from "./modal-card/microcontroller-vehicle-modal-card";
import { MicrocontrollerCoordinatesModalCard } from "./modal-card/microcontroller-coordinates-modal-card";
import { MicrocontrollerDatesModalCard } from "./modal-card/microcontroller-dates-modal-card";
import { MicrocontrollerCoordinateHistory } from "./microcontroller-coordinates-history/microcontroller-coordinates-history";
import { Coordinate } from "@/domain/coordinates/coordinate.model";

export const getVehicleTypeName = (type: string) => {
  switch (type) {
    case "CAR":
      return "Carro";
    case "MOTORCYCLE":
      return "Motocicleta";
    case "TRUCK":
      return "Caminhão";
    default:
      return type;
  }
};

interface MicrocontrollerModalProps {
  microcontroller: Microcontroller | null;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  setMicrocontroller: (microcontroller: Microcontroller | null) => void;
}

export function MicrocontrollerModal({
  isModalOpen,
  setIsModalOpen,
  microcontroller: defaultMicrocontroller,
  setMicrocontroller,
}: MicrocontrollerModalProps) {
  const { data: microcontroller } = useQuery<Microcontroller | null>({
    queryKey: ["microcontroller", defaultMicrocontroller?.id],
    enabled: !!defaultMicrocontroller?.id,
    refetchOnWindowFocus: false,
    refetchInterval: 5000,
    initialData: defaultMicrocontroller,
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/microcontroller/latest-coordinates/${defaultMicrocontroller?.id}`
      );
      return await response.json();
    },
  });

  const [selectedCoordinate, setSelectedCoordinate] =
    useState<Coordinate | null>(null);

  useEffect(() => {
    const coord = microcontroller?.coordinates;

    if (coord?.length && coord?.length > 0) {
      setSelectedCoordinate(coord[coord.length - 1]);
    }
  }, [microcontroller?.coordinates]);

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        setIsModalOpen(open);
        setTimeout(() => setMicrocontroller(null), 300);
      }}
    >
      <DialogContent className="max-h-[85vh] md:max-h-[98vh] overflow-y-auto max-w-7xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Cpu className="h-5 w-5" />
            {microcontroller?.name}
            <Badge
              variant={microcontroller?.active ? "default" : "destructive"}
              className="ml-2"
            >
              {microcontroller?.active ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <XCircle className="h-3 w-3 mr-1" />
              )}
              {microcontroller?.active ? "Ativo" : "Inativo"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex gap-4 grow"
        >
          <div className="flex flex-col w-1/3 gap-4">
            <MicrocontrollerDetailsModalCard
              microcontroller={microcontroller!}
            />
            <MicrocontrollerVeichleModalCard
              microcontroller={microcontroller!}
            />
            <MicrocontrollerCoordinatesModalCard
              microcontroller={microcontroller!}
            />
            <MicrocontrollerDatesModalCard microcontroller={microcontroller!} />
          </div>

          <div className="w-2/3 gap-4 flex flex-col">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Mapa de Localização
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="w-full h-full rounded-lg">
                  <Map
                    center={[
                      selectedCoordinate?.latitude ?? 0,
                      selectedCoordinate?.longitude ?? 0,
                    ]}
                    locations={
                      microcontroller?.coordinates?.map((coord) => ({
                        position: [coord.latitude, coord.longitude],
                        name: microcontroller.name,
                      })) ?? []
                    }
                  />
                </div>
              </CardContent>
            </Card>
            <MicrocontrollerCoordinateHistory
              coordinates={microcontroller?.coordinates}
              selectedCoordinate={selectedCoordinate}
              onCoordinateSelect={setSelectedCoordinate}
            />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
