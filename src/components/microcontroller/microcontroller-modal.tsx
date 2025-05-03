"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Wifi,
  Car,
  Bike,
  Truck,
  Tag,
  MapPin,
  CheckCircle,
  XCircle,
  Fingerprint,
  Layers,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Microcontroller } from "@/@types/microcontroller";
import { Slider } from "../ui/slider";

interface MicrocontrollerModalProps {
  microcontroller: Microcontroller;
  isOpen: boolean;
  onClose: () => void;
  map: React.ReactNode;
}

export function MicrocontrollerModal({
  microcontroller,
  isOpen,
  onClose,
  map,
}: MicrocontrollerModalProps) {
  const [activeTab, setActiveTab] = useState("info");
  const [date, setDate] = useState<Date | undefined>(new Date());
  // const [time, setTime] = useState<string>("12:00");
  const [isSearching, setIsSearching] = useState(false);

  // Determinar a cor do chip
  const getChipColor = (chip: string) => {
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
  const getVehicleIcon = () => {
    switch (microcontroller.type) {
      case "CAR":
        return <Car className="h-5 w-5 mr-2" />;
      case "BIKE":
        return <Bike className="h-5 w-5 mr-2" />;
      case "TRUCK":
        return <Truck className="h-5 w-5 mr-2" />;
      default:
        return <Car className="h-5 w-5 mr-2" />;
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    // Aqui você implementaria a lógica para buscar a localização na data/hora específica
    // Por exemplo, uma chamada API para obter as coordenadas naquele momento

    // Simulando uma busca com timeout
    setTimeout(() => {
      setIsSearching(false);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] md:max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {microcontroller.name}
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
          </DialogTitle>
          <DialogDescription>
            Detalhes completos do microcontrolador
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="info"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="real-time">Tempo real</TabsTrigger>
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="coordinates">Coordenadas</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="real-time" className="mt-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Localização por Período</CardTitle>
                    <CardDescription>
                      Busque a localização do dispositivo em uma data e hora
                      específicas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-3/5 h-[300px] md:h-[500px] rounded-md overflow-hidden border">
                        {map}
                      </div>

                      <div className="w-full md:w-2/5 space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">
                            Selecione data e hora
                          </h3>

                          <div className="grid grid-cols-1 gap-3">
                            <div className="space-y-1">
                              <label
                                htmlFor="date-input"
                                className="text-sm font-medium"
                              >
                                Data
                              </label>
                              <input
                                type="date"
                                id="date-input"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={
                                  date ? date.toISOString().split("T")[0] : ""
                                }
                                onChange={(e) =>
                                  setDate(
                                    e.target.value
                                      ? new Date(e.target.value)
                                      : undefined
                                  )
                                }
                              />
                            </div>

                            <div className="space-y-1">
                              <label
                                htmlFor="time-input"
                                className="text-sm font-medium"
                              >
                                Hora
                              </label>
                              <div className="relative">
                                <Slider
                                  id="time-input"
                                  min={0}
                                  max={23}
                                  step={1}
                                />
                              </div>
                            </div>

                            <button
                              className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${
                                isSearching ? "opacity-80" : ""
                              }`}
                              disabled={isSearching || !date}
                              onClick={handleSearch}
                            >
                              {isSearching ? (
                                <>
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Buscando...
                                </>
                              ) : (
                                "Buscar localização"
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="border rounded-md p-3 space-y-2">
                          <h3 className="text-sm font-medium">
                            Última localização conhecida
                          </h3>
                          {microcontroller.coordinates &&
                          microcontroller.coordinates.length > 0 ? (
                            <>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">
                                    Latitude:
                                  </span>
                                  <p>
                                    {microcontroller.coordinates[0].latitude.toFixed(
                                      6
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Longitude:
                                  </span>
                                  <p>
                                    {microcontroller.coordinates[0].longitude.toFixed(
                                      6
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Última atualização:{" "}
                                {new Date().toLocaleString("pt-BR")}
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Nenhuma coordenada disponível
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="info" className="mt-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Detalhes do Dispositivo</CardTitle>
                    <CardDescription>
                      Informações técnicas do microcontrolador
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Fingerprint className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">UID</p>
                            <p className="text-sm text-muted-foreground">
                              {microcontroller.uid}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Wifi className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">MAC Address</p>
                            <p className="text-sm text-muted-foreground">
                              {microcontroller.mac_address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <h3 className="text-sm font-medium mb-2">
                        Especificações
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center p-3 border rounded-md">
                          <Cpu className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Modelo</p>
                            <p className="text-sm text-muted-foreground">
                              {microcontroller.model}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 border rounded-md">
                          <Badge
                            variant="outline"
                            className={`flex items-center ${getChipColor(
                              microcontroller.chip
                            )}`}
                          >
                            {microcontroller.chip}
                          </Badge>
                          <div className="ml-2">
                            <p className="text-sm font-medium">Chip</p>
                            <p className="text-sm text-muted-foreground">
                              Operadora
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <h3 className="text-sm font-medium mb-2">Veículo</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center p-3 border rounded-md">
                          {getVehicleIcon()}
                          <div>
                            <p className="text-sm font-medium">Tipo</p>
                            <p className="text-sm text-muted-foreground">
                              {microcontroller.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 border rounded-md">
                          <Tag className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Placa</p>
                            <p className="text-sm text-muted-foreground">
                              {microcontroller.plate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="coordinates" className="mt-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Histórico de Coordenadas</CardTitle>
                    <CardDescription>
                      Últimas localizações registradas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {microcontroller.coordinates &&
                    microcontroller.coordinates.length > 0 ? (
                      <div className="space-y-4">
                        {microcontroller.coordinates.map((coord, index) => (
                          <motion.div
                            key={coord.uid}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.1 }}
                            className="flex items-start p-3 border rounded-md"
                          >
                            <MapPin className="h-5 w-5 mr-2 text-muted-foreground mt-1" />
                            <div>
                              <div className="flex items-center">
                                <p className="text-sm font-medium">
                                  Coordenada {index + 1}
                                </p>
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs"
                                >
                                  UID: {coord.uid.substring(0, 8)}...
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Latitude: {coord.latitude.toFixed(6)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Longitude: {coord.longitude.toFixed(6)}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Layers className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          Nenhuma coordenada disponível
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
