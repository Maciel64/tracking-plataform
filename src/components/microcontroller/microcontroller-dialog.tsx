"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createMicrocontroller,
  updateMicrocontroller,
} from "@/domain/microcontrollers/microcontroller.actions";
import type {
  Microcontroller,
  VehicleType,
} from "@/domain/microcontrollers/microcontroller.model";
import { generateRandomMicroName } from "@/helpers/microcontroller";
import {
  type CreateMicrocontrollerSchema,
  createMicrocontrollerSchema,
} from "@/schemas/microcontroller.schema";

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
    resolver: zodResolver(createMicrocontrollerSchema),
    defaultValues: {
      name: currentMicro?.name || "",
      macAddress: currentMicro?.macAddress || "",
      model: currentMicro?.model || "Rastcom1",
      chip: currentMicro?.chip || "VIVO",
      plate: currentMicro?.plate || "",
      vehicleType: currentMicro?.vehicleType || "CAR",
    },
  });

  useEffect(() => {
    reset({
      name: currentMicro?.name || generateRandomMicroName(),
      macAddress: currentMicro?.macAddress || "",
      model: currentMicro?.model || "Rastcom1",
      chip: currentMicro?.chip || "VIVO",
      plate: currentMicro?.plate || "",
      vehicleType: currentMicro?.vehicleType || "CAR",
    });
  }, [currentMicro, reset]);

  function submit(data: CreateMicrocontrollerSchema) {
    startTransition(async () => {
      const result = await (currentMicro
        ? updateMicrocontroller(
            session?.user?.id || "",
            session?.user?.activeEnterprise?.id || "",
            currentMicro.id,
            data,
          )
        : createMicrocontroller(session?.user?.id || "", data));

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(
        currentMicro
          ? "Microcontrolador atualizado com sucesso!"
          : "Microcontrolador criado com sucesso!",
      );

      setIsDialogOpen(false);
      setCurrentMicro(null);
      reset({
        active: true,
        chip: "VIVO",
        macAddress: "",
        model: "Rastcomw1",
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
          className="mt-4"
          onClick={async () => {
            setCurrentMicro(null);
            setIsDialogOpen(true);
            reset({
              name: generateRandomMicroName(),
              macAddress: "",
              model: "Rastcom1",
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
              <Input {...register("name")} className="bg-card" />
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
                  <SelectItem value="Rastcom1">Rastcom 1</SelectItem>
                  <SelectItem value="Rastcom2">Rastcom 2</SelectItem>
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
              <Input {...register("plate")} placeholder="ABC1A23" />
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
                  <SelectItem value="MOTORCYCLE">Moto</SelectItem>
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
                disabled={isPending}
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
