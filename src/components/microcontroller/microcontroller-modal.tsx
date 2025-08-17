"use client";

import { CheckCircle, Cpu, MapPin, XCircle } from "lucide-react";
import { DialogContent, Dialog, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Microcontroller } from "@/domain/microcontrollers/microcontroller.model";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Map from "../map";
import { MicrocontrollerDetailsModalCard } from "./modal-card/microcontroller-details-modal-card";
import { MicrocontrollerVeichleModalCard } from "./modal-card/microcontroller-vehicle-modal-card";
import { MicrocontrollerCoordinatesModalCard } from "./modal-card/microcontroller-coordinates-modal-card";
import { MicrocontrollerDatesModalCard } from "./modal-card/microcontroller-dates-modal-card";

export const formatDate = (date?: Date) => {
  if (!date) return "N/A";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

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
          className="grid gap-2
             grid-cols-1 
             lg:grid-cols-3 
             lg:grid-rows-4
             lg:[grid-template-areas:'details_map_map'_'vehicle_map_map'_'coords_map_map'_'dates_extra_extra']"
        >
          <div className="lg:[grid-area:details]">
            <MicrocontrollerDetailsModalCard
              microcontroller={microcontroller!}
            />
          </div>

          <div className="lg:[grid-area:vehicle]">
            <MicrocontrollerVeichleModalCard
              microcontroller={microcontroller!}
            />
          </div>

          <div className="lg:[grid-area:coords]">
            <MicrocontrollerCoordinatesModalCard
              microcontroller={microcontroller!}
            />
          </div>

          <div className="lg:[grid-area:dates]">
            <MicrocontrollerDatesModalCard microcontroller={microcontroller!} />
          </div>

          <Card className="lg:[grid-area:map] h-full">
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
                    microcontroller?.coordinates?.[0]?.latitude ?? 0,
                    microcontroller?.coordinates?.[0]?.longitude ?? 0,
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

          <div className="lg:[grid-area:extra]">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Informações Adicionais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Conteúdo adicional aqui
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
