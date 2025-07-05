"use client";

import {
  Calendar,
  Car,
  CheckCircle,
  Cpu,
  Hash,
  MapPin,
  Tag,
  Wifi,
  XCircle,
} from "lucide-react";
import { DialogContent, Dialog, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Microcontroller } from "@/domain/microcontrollers/microcontroller.model";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getChipColor, getVehicleIcon } from "./microcontroller-card";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Map from "../map";

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
      <DialogContent className="max-h-[85vh] md:max-h-[98vh] overflow-y-auto">
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
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-y-auto pr-2"
        >
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Dispositivo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono text-xs">
                    {microcontroller?.id?.slice(0, 8)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modelo:</span>
                  <Badge variant="outline" className="text-xs">
                    <Cpu className="h-3 w-3 mr-1" />
                    {microcontroller?.model}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MAC:</span>
                  <span className="font-mono text-xs">
                    {microcontroller?.macAddress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chip:</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getChipColor(
                      microcontroller?.chip || ""
                    )}`}
                  >
                    <Wifi className="h-3 w-3 mr-1" />
                    {microcontroller?.chip}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Veículo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Placa:</span>
                  <Badge variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {microcontroller?.plate}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <Badge variant="outline" className="text-xs">
                    {getVehicleIcon(microcontroller?.vehicleType || "")}
                    {getVehicleTypeName(microcontroller?.vehicleType || "")}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Usuário:</span>
                  <span className="font-mono text-xs">
                    {microcontroller?.userId?.slice(0, 8)}...
                  </span>
                </div>
              </CardContent>
            </Card>

            {microcontroller?.coordinates &&
              microcontroller?.coordinates.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Localização Atual
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Latitude:</span>
                      <span className="font-mono text-xs">
                        {microcontroller?.coordinates[0].latitude}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Longitude:</span>
                      <span className="font-mono text-xs">
                        {microcontroller?.coordinates[0].longitude}
                      </span>
                    </div>
                    {microcontroller?.coordinates[0].createdAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Atualizado:
                        </span>
                        <span className="text-xs">
                          {formatDate(
                            microcontroller?.coordinates[0].createdAt
                          )}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

            {/* Datas - Apenas no desktop */}
            <div className="hidden lg:block">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Registro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Criado:</span>
                    <span className="text-xs">
                      {formatDate(microcontroller?.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Atualizado:</span>
                    <span className="text-xs">
                      {formatDate(microcontroller?.updatedAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Mapa de Localização
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="w-full rounded-lg ">
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
          </div>

          {microcontroller?.coordinates &&
            microcontroller.coordinates.length > 1 && (
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Últimas Localizações ({microcontroller.coordinates.length}
                      )
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                      {microcontroller.coordinates
                        ?.slice(0, 6)
                        ?.map((coord, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex flex-col p-2 bg-muted rounded-lg text-xs"
                          >
                            <div className="flex items-center gap-1 mb-1">
                              <MapPin className="h-3 w-3" />
                              <span className="font-mono">
                                {coord.latitude.toFixed(4)},{" "}
                                {coord.longitude.toFixed(4)}
                              </span>
                            </div>
                            {coord.createdAt && (
                              <span className="text-muted-foreground text-xs">
                                {formatDate(coord.createdAt)}
                              </span>
                            )}
                          </motion.div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

          <div className="lg:hidden col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Registro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Criado:</span>
                  <span className="text-xs">
                    {formatDate(microcontroller?.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Atualizado:</span>
                  <span className="text-xs">
                    {formatDate(microcontroller?.updatedAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
