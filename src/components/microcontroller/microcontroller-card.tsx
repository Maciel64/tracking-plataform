"use client";

import type React from "react";

import { motion } from "framer-motion";
import {
  MapPin,
  Cpu,
  Wifi,
  Car,
  Bike,
  Truck,
  Tag,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Microcontroller } from "@/domain/microcontrollers/microcontroller.model";
import { Button } from "../ui/button";

export const getChipColor = (chip: string) => {
  switch (chip) {
    case "VIVO":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "CLARO":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "TIM":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

// Determinar o ícone do tipo de veículo
export const getVehicleIcon = (vehicleType: string) => {
  switch (vehicleType) {
    case "CAR":
      return <Car className="h-4 w-4 mr-1" />;
    case "MOTORCYCLE":
      return <Bike className="h-4 w-4 mr-1" />;
    case "TRUCK":
      return <Truck className="h-4 w-4 mr-1" />;
    default:
      return <Car className="h-4 w-4 mr-1" />;
  }
};

interface MicrocontrollerCardProps {
  microcontroller: Microcontroller;
  map: React.ReactNode;
  setMicrocontroller: (microcontroller: Microcontroller | null) => void;
  setIsModalOpen: (isOpen: boolean) => void;
}

export function MicrocontrollerCard({
  microcontroller,
  map,
  setMicrocontroller,
  setIsModalOpen,
}: MicrocontrollerCardProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
        className="h-full"
      >
        <Card className="h-full flex flex-col overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold truncate">
                {microcontroller.name}
              </CardTitle>
              <Badge
                variant={microcontroller.active ? "default" : "destructive"}
                className="ml-2"
              >
                {microcontroller.active ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {microcontroller.active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="flex items-center">
                <Cpu className="h-3 w-3 mr-1" />
                {microcontroller.model}
              </Badge>
              <Badge
                variant="outline"
                className={`flex items-center ${getChipColor(
                  microcontroller.chip
                )}`}
              >
                <Wifi className="h-3 w-3 mr-1" />
                {microcontroller.chip}
              </Badge>
              <Badge variant="outline" className="flex items-center">
                {getVehicleIcon(microcontroller?.vehicleType)}
                {microcontroller.vehicleType}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-0">
            <div className="h-[200px] w-full overflow-hidden">{map}</div>
          </CardContent>
          <CardFooter className="flex flex-col items-start pt-4 pb-4">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Tag className="h-4 w-4 mr-1" />
              <span className="font-medium">Placa:</span>{" "}
              {microcontroller.plate}
            </div>
            <div className="flex text-sm text-muted-foreground mb-4 w-full">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="font-medium">
                Coordenadas: {microcontroller.coordinates?.[0]?.latitude},{" "}
                {microcontroller.coordinates?.[0]?.longitude}
              </span>{" "}
            </div>
            <Button
              className="w-full"
              variant="default"
              onClick={() => {
                setIsModalOpen(true);
                setMicrocontroller(microcontroller);
              }}
            >
              Visualizar
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  );
}
