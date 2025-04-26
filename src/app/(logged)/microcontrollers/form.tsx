import { LoaderCircle, PlusCircle } from "lucide-react";

import { Microcontroller } from "@/@types/microcontroller";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { query as queryClient } from "@/providers/client-provider";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/adapters/firebase.adapter";
import { useMutation } from "@tanstack/react-query";
import { FirebaseError } from "firebase/app";
import { where } from "firebase/firestore";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger } from "@/components/ui/select";
import { z } from "zod";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface MicrocontrollersFormProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  currentMicro: Microcontroller | null;
  setCurrentMicro: (micro: Microcontroller | null) => void;
}

export type Type = "CAR" | "BIKE" | "TRUCK";
export type Chip = "VIVO" | "CLARO" | "TIM";
export type Model = "Raster1" | "Raster2";
export type Role = "ADMIN" | "USER";

const microcontrollerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  mac_address: z
    .string()
    .regex(/^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/, "MAC inválido"),
  model: z.enum(["Raster1", "Raster2"], {
    required_error: "Modelo é obrigatório",
  }),
  chip: z.enum(["VIVO", "CLARO", "TIM"], {
    required_error: "Chip é obrigatório",
  }),
  plate: z.string().min(1, "Placa é obrigatória"),
  type: z.enum(["CAR", "BIKE", "TRUCK"], {
    required_error: "Tipo é obrigatório",
  }),
  active: z.boolean().default(true),
});

export type MicrocontrollerSchema = z.infer<typeof microcontrollerSchema> & {
  id?: string;
};

export function MicrocontrollersForm({
  isDialogOpen,
  setIsDialogOpen,
  currentMicro,
  setCurrentMicro,
}: MicrocontrollersFormProps) {
  const { theme } = useTheme();
  const auth = useSession();

  async function refetchRandomName(): Promise<{ data: string | null }> {
    try {
      const randomName = `Micro_${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`.substring(0, 10);
      return { data: randomName };
    } catch (error) {
      console.error("Error generating random name:", error);
      return { data: null };
    }
  }

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(microcontrollerSchema),
    defaultValues: {
      name: currentMicro?.name || "",
      mac_address: currentMicro?.mac_address || "",
      model: currentMicro?.model || "Raster1",
      chip: currentMicro?.chip || "VIVO",
      plate: currentMicro?.plate || "",
      type: currentMicro?.type || "CAR",
    },
  });

  const createEditMicroMutation = useMutation<
    void,
    FirebaseError,
    Microcontroller
  >({
    mutationFn: async (data) => {
      const userId = auth.data?.user?.id;

      const microRef = collection(db, "microcontrollers");
      const macQuery = query(
        microRef,
        where("mac_address", "==", data.mac_address)
      );
      const placaQuery = query(microRef, where("plate", "==", data.plate));

      const [macSnapshot, placaSnapshot] = await Promise.all([
        getDocs(macQuery),
        getDocs(placaQuery),
      ]);

      if (!currentMicro) {
        if (!macSnapshot.empty) {
          throw new Error(
            "Já existe um microcontrolador com este MAC Address."
          );
        }
        if (!placaSnapshot.empty) {
          throw new Error("Já existe um microcontrolador com esta placa.");
        }
      } else {
        if (!macSnapshot.empty && macSnapshot.docs[0].id !== currentMicro.uid) {
          throw new Error(
            "Já existe um microcontrolador com este MAC Address."
          );
        }
        if (
          !placaSnapshot.empty &&
          placaSnapshot.docs[0].id !== currentMicro.uid
        ) {
          throw new Error("Já existe um microcontrolador com esta placa.");
        }
      }

      if (currentMicro) {
        const updateMicro = {
          name: data.name,
          mac_address: data.mac_address,
          model: data.model,
          chip: data.chip,
          plate: data.plate,
          type: data.type,
          active: data.active,
          updatedAt: new Date().toISOString(),
        };
        await updateDoc(
          doc(db, "microcontrollers", currentMicro.uid!),
          updateMicro
        );
        return;
      }

      const newMicro = {
        name: data.name,
        mac_address: data.mac_address,
        model: data.model,
        chip: data.chip,
        plate: data.plate,
        type: data.type,
        active: true,
        user_id: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDoc(microRef, newMicro);
    },
    onSuccess: () => {
      toast.success("Microcontrolador atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["microcontrollers"] });
      setIsDialogOpen(false);
      reset();
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível criar o Microcontrolador");
      }
    },
  });

  useEffect(() => {
    if (currentMicro) {
      reset({
        name: currentMicro.name,
        mac_address: currentMicro.mac_address,
        model: currentMicro.model,
        chip: currentMicro.chip,
        plate: currentMicro.plate,
        type: currentMicro.type,
      });
    }
  }, [currentMicro, reset]);

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
            const res = await refetchRandomName();
            reset({
              name: res.data ?? "",
              mac_address: "",
              model: "Raster1",
              chip: "VIVO",
              plate: "",
              type: "CAR",
            });
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Microcontrolador
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`sm:max-w-[425px] ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <form
          onSubmit={handleSubmit((data) =>
            createEditMicroMutation.mutate(data as Microcontroller)
          )}
        >
          <DialogHeader>
            <DialogTitle
              className={`${theme === "dark" ? "text-white" : "text-black"}`}
            >
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
                {...register("mac_address")}
                id="mac"
                value={undefined}
                placeholder="00:11:22:33:44:55"
              />
              {errors.mac_address && (
                <p className="text-sm text-destructive">
                  {errors.mac_address.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select
                onValueChange={(value: Model) => setValue("model", value)}
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
                onValueChange={(value: Chip) => setValue("chip", value)}
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
                onValueChange={(value: Type) => setValue("type", value)}
                value={watch("type")}
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
              {errors.type && (
                <p className="text-sm text-destructive">
                  {errors.type.message}
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
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={createEditMicroMutation.isPending}
              >
                {createEditMicroMutation.isPending ? (
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
