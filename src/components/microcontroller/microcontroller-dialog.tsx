"use client";

import { LoaderCircle, PlusCircle } from "lucide-react";

import {
  Microcontroller,
  VehicleType,
} from "@/domain/microcontrollers/microcontroller.model";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger } from "@/components/ui/select";
import {
  MicrocontrollerSchema,
  microcontrollerSchema,
} from "@/schemas/microcontroller.schema";
import { generateRandomMicroName } from "@/helpers/microcontroller";
import { useEffect, useTransition } from "react";
import {
  createMicrocontroller,
  updateMicrocontroller,
} from "@/domain/microcontrollers/microcontroller.actions";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface MicrocontrollersDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  currentMicro: Microcontroller | null;
  setCurrentMicro: (micro: Microcontroller | null) => void;
}

export function MicrocontrollersDialog({
  isDialogOpen,
  setIsDialogOpen,
  currentMicro,
  setCurrentMicro,
}: MicrocontrollersDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  const {
    register,
    setValue,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(microcontrollerSchema),
    defaultValues: {
      name: currentMicro?.name || "",
      macAddress: currentMicro?.macAddress || "",
      model: currentMicro?.model || "Raster1",
      chip: currentMicro?.chip || "VIVO",
      plate: currentMicro?.plate || "",
      vehicleType: currentMicro?.vehicleType || "CAR",
    },
  });

  useEffect(() => {
    reset({
      name: currentMicro?.name || generateRandomMicroName(),
      macAddress: currentMicro?.macAddress || "",
      model: currentMicro?.model || "Raster1",
      chip: currentMicro?.chip || "VIVO",
      plate: currentMicro?.plate || "",
      vehicleType: currentMicro?.vehicleType || "CAR",
    });
  }, [currentMicro, reset]);

  function submit(data: MicrocontrollerSchema) {
    startTransition(async () => {
      const result = await (currentMicro
        ? updateMicrocontroller(session!.user.id, currentMicro.id, data)
        : createMicrocontroller(session!.user.id, data));

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(
        currentMicro
          ? "Microcontrolador atualizado com sucesso!"
          : "Microcontrolador criado com sucesso!"
      );

      setIsDialogOpen(false);
      setCurrentMicro(null);
      reset({
        active: true,
        chip: "VIVO",
        macAddress: "",
        model: "Raster1",
        name: generateRandomMicroName(),
        plate: "",
        vehicleType: "CAR",
      });
    });
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={async (open) => {
        setIsDialogOpen(open);
        if (!open) {
          reset();
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setCurrentMicro(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer"
          onClick={async () => {
            setCurrentMicro(null);
            setIsDialogOpen(true);
            reset({
              name: generateRandomMicroName(),
              macAddress: "",
              model: "Raster1",
              chip: "VIVO",
              plate: "",
              vehicleType: "CAR",
            });
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Microcontrolador
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(submit)}>
          <DialogHeader>
            <DialogTitle>
              {currentMicro
                ? "Editar Microcontrolador"
                : "Adicionar Microcontrolador"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Nome
              </Label>
              <Input {...register("name")} id="name" className="bg-card" />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mac">MAC Address</Label>
              <Input
                {...register("macAddress")}
                id="mac"
                value={undefined}
                placeholder="00:11:22:33:44:55"
              />
              {errors.macAddress && (
                <p className="text-sm text-destructive">
                  {errors.macAddress.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select
                onValueChange={(value) => setValue("model", value)}
                value={watch("model")}
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Raster1">Raster 1</SelectItem>
                  <SelectItem value="Raster2">Raster 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Chip</Label>
              <Select
                onValueChange={(value) => setValue("chip", value)}
                value={watch("chip")}
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Selecione o chip" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIVO">VIVO</SelectItem>
                  <SelectItem value="CLARO">CLARO</SelectItem>
                  <SelectItem value="TIM">TIM</SelectItem>
                </SelectContent>
              </Select>
              {errors.chip && (
                <p className="text-sm text-destructive">
                  {errors.chip.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="plate">Placa</Label>
              <Input {...register("plate")} id="plate" placeholder="ABC1A23" />
              {errors.plate && (
                <p className="text-sm text-destructive">
                  {errors.plate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tipo de veículo</Label>
              <Select
                onValueChange={(value) =>
                  setValue("vehicleType", value as VehicleType)
                }
                value={watch("vehicleType")}
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Tipo de veículo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAR">Carro</SelectItem>
                  <SelectItem value="BIKE">Moto</SelectItem>
                  <SelectItem value="TRUCK">Caminhão</SelectItem>
                </SelectContent>
              </Select>
              {errors.vehicleType && (
                <p className="text-sm text-destructive">
                  {errors.vehicleType.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                onClick={() => {
                  setIsDialogOpen(false);
                  reset();
                }}
                className="cursor-pointer"
                variant="outline"
              >
                Cancelar
              </Button>
              <Button type="submit" className="min-w-52" disabled={isPending}>
                {isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : currentMicro ? (
                  "Salvar Alterações"
                ) : (
                  "Adicionar Microcontrolador"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
