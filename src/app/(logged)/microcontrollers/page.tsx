"use client";

import { useState } from "react";
import { db } from "@/lib/adapters/firebase.adapter";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogOverlay,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pencil,
  Trash2,
  LoaderCircle,
  CheckCircle,
  XCircle,
  Filter,
  PlusCircle,
  Cpu,
} from "lucide-react";
import { useTheme } from "next-themes";
import { DialogPortal } from "@radix-ui/react-dialog";

// zod <> React Hook Form
import { z } from "zod";
import { useForm } from "react-hook-form";

// Ensure 'reset' is available from useForm

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/@types/user";
import { FirebaseError } from "firebase/app";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Microcontrollers } from "@/components/server/microcontrollers";
import { TCreateUserSchema } from "../users/page";
import { m } from "motion/react";
import { set } from "date-fns";

interface FormErrors {
  nome?: string;
  mac_address?: string;
  modelo?: string;
  chip?: string;
  placa?: string;
  tipo?: string;
}

{
  /*==========================Cria um esquema ZOD com validações===========================*/
}
const microcontrollerSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  mac_address: z
    .string()
    .regex(/^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/, "MAC inválido"),
  modelo: z.enum(["Raster1", "Raster2"], {
    required_error: "Modelo é obrigatório",
  }),
  chip: z.enum(["VIVO", "CLARO", "TIM"], {
    required_error: "Chip é obrigatório",
  }),
  placa: z.string().min(1, "Placa é obrigatória"),
  tipo: z.enum(["carro", "moto", "caminhão"], {
    required_error: "Tipo é obrigatório",
  }),
  ativo: z.boolean().default(true), // Added 'ativo' property
});

export type Microcontroller = z.infer<typeof microcontrollerSchema> & {
  id?: string;
};

function MicrocontrollersPage() {
  const { theme } = useTheme();
  const { reset: formReset } = useForm();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMicro, setCurrentMicro] = useState<Microcontroller | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [microToDelete, setmicroToDelete] = useState<string | null>(null);

  const {
    register,
    formState: { errors },
    setValue,
    reset,
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(microcontrollerSchema),
    defaultValues: {
      nome: currentMicro?.nome || "",
      mac_address: currentMicro?.mac_address || "",
      modelo: currentMicro?.modelo || "Raster1",
      chip: currentMicro?.chip || "VIVO",
      placa: currentMicro?.placa || "",
      tipo: currentMicro?.tipo || "carro",
    },
  });

  const { data: microcontrollers, isLoading } = useQuery({
    queryKey: ["microcontrollers"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "microcontrollers"));
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome || "",
        mac_address: doc.data().mac_address || "",
        modelo: doc.data().modelo || "",
        chip: doc.data().chip || "",
        ativo: doc.data().ativo || true,
        placa: doc.data().placa || "",
        tipo: doc.data().tipo || "",
        createdAt: doc.data().createdAt || "",
        updatedAt: doc.data().updatedAt || "",
      }));
    },
  });

  {
    /*======================adicionar /editar microcontroller====================== */
  }

  const createEditMicroMutation = useMutation<
    void,
    FirebaseError,
    Microcontroller
  >({
    mutationFn: async (data) => {
      const { nome, mac_address, modelo, chip, placa, tipo } = data;

      if (currentMicro) {
        const updateMicro = {
          nome,
          mac_address,
          modelo,
          chip,
          placa,
          tipo,
          updateDat: new Date().toISOString,
        };
        await updateDoc(
          doc(db, "microcontrollers", currentMicro.id!),
          updateMicro
        );
        return;
      }
      const newMicro = {
        nome,
        mac_address,
        modelo,
        chip,
        placa,
        tipo,
        ativo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
    onSuccess: () => {
      toast.success("Microcontrolador atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["microcontrollers"] });
      setIsDialogOpen(false);
      reset();
    },
    onError: () => {
      toast.error("Não foi possível criar o Microcontrolador");
    },
  });

  {
    /*===================================== DELETAR ================================== */
  }

  const handleDelete = (userId: string) => {
    setmicroToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!microToDelete) return;

    setIsDeleting(true);
    try {
      const userRef = doc(db, "microcontrollers", microToDelete);
      await deleteDoc(userRef);

      setIsDeleteDialogOpen(false);
      toast.success("O usuário foi apagado com sucesso");
      queryClient.invalidateQueries({
        queryKey: ["microcontrollers"],
      });
    } catch (error) {
      toast.error("Não foi possível apagar o usuário");
      console.error("Erro ao apagar usuário:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  /*========================RETORNO=========================*/

  return (
    <div className="p-4 min-h-screen bg-background text-foreground overflow-x-auto h-[calc(100vh-6rem)]">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Microcontroladores
        </span>
      </h1>
      <p className="mt-2 text-muted-foreground pb-4">
        Gerencie todos os microcontroladores
      </p>

      {/*=============Adicionar microcontrolador================ */}

      <form
        onSubmit={handleSubmit((data) => createEditMicroMutation.mutate(data))}
      >
        <div className="mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Microcontrolador
              </Button>
            </DialogTrigger>
            <DialogContent
              className={`sm:max-w-[425px] ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <DialogHeader>
                <DialogTitle
                  className={`${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Adicionar Microcontrolador
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-foreground">
                    Nome
                  </Label>
                  <Input
                    {...register("nome")}
                    id="nome"
                    value={undefined}
                    className="bg-card"
                  />
                  {<p className="text-sm text-destructive"></p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mac">MAC Address</Label>
                  <Input
                    {...register("mac_address")}
                    id="mac"
                    value={undefined}
                    placeholder="00:11:22:33:44:55"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Modelo</Label>
                  <Select>
                    <SelectTrigger>
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
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o chip" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIVO">VIVO</SelectItem>
                      <SelectItem value="CLARO">CLARO</SelectItem>
                      <SelectItem value="TIM">TIM</SelectItem>
                    </SelectContent>
                  </Select>
                  {<p className="text-sm text-destructive"></p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="placa">Placa</Label>
                  <Input
                    {...register("placa")}
                    id="placa"
                    placeholder="ABC1A23"
                  />
                  {<p className="text-sm text-destructive"></p>}
                </div>

                <div className="space-y-2">
                  <Label>Tipo de veículo</Label>
                  <Select value={undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carro">Carro</SelectItem>
                      <SelectItem value="moto">Moto</SelectItem>
                      <SelectItem value="caminhão">Caminhão</SelectItem>
                    </SelectContent>
                  </Select>
                  {<p className="text-sm text-destructive">{}</p>}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button className="cursor-pointer" variant="outline">
                    Cancelar
                  </Button>
                  <Button type="submit" className="cursor-pointer">
                    Cadastrar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </form>
      {/*==========Filtro depesquisa=============== */}

      <div className="border rounded-lg mb-4 p-4 bg-card">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filtros e pesquisa</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Buscar por nome, MAC, modelo ou placa..."
            className="max-w-sm"
          />
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Lista de microcontroladores</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          microcontroladores cadastrados
        </p>

        <div className="overflow-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-secondary border-b">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Nome</th>
                <th className="p-2 text-left">MAC Address</th>
                <th className="p-2 text-left">Modelo</th>
                <th className="p-2 text-left">Chip</th>
                <th className="p-2 text-left">Placa</th>
                <th className="p-2 text-left">Tipo</th>
                <th className="p-2 text-left">Ativo</th>
                <th className="p-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {microcontrollers?.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-accent">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{item.nome}</td>
                  <td className="p-2">{item.mac_address}</td>
                  <td className="p-2">{item.modelo}</td>
                  <td className="p-2">{item.chip}</td>
                  <td className="p-2">{item.placa}</td>
                  <td className="p-2">{item.tipo}</td>
                  <td className="p-2">{item.ativo ? "SIM" : "NÃO"}</td>
                  <td className="p-2 flex gap-2">
                    {/*===============EDITAR=============== {cn("sm:max-w-[425px]",theme === "light" ? "bg-white" : "bg-black")}*/}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-primary border-primary cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>

                      <DialogPortal>
                        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
                        <DialogContent className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white/90 dark:bg-gray-900/90 p-6 shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                          <DialogHeader>
                            <DialogTitle>Editar Microcontrolador</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-nome">Nome</Label>
                              <Input
                                id="edit-nome"
                                className="bg-white dark:bg-zinc-800 dark:text-white"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-mac">MAC Address</Label>
                              <Input
                                id="edit-mac"
                                className="bg-white dark:bg-zinc-800 dark:text-white"
                                placeholder="00:11:22:33:44:55"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Modelo</Label>
                              <Select>
                                <SelectTrigger className="dark:bg-zinc-800 dark:text-white">
                                  <SelectValue placeholder="Selecione o modelo" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-zinc-800 dark:text-white">
                                  <SelectItem value="Raster1">
                                    Raster 1
                                  </SelectItem>
                                  <SelectItem value="Raster2">
                                    Raster 2
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Chip</Label>
                              <Select>
                                <SelectTrigger className="dark:bg-zinc-800 dark:text-white">
                                  <SelectValue placeholder="Selecione o chip" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-zinc-800 dark:text-white">
                                  <SelectItem value="VIVO">VIVO</SelectItem>
                                  <SelectItem value="CLARO">CLARO</SelectItem>
                                  <SelectItem value="TIM">TIM</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-placa">Placa</Label>
                              <Input
                                id="edit-placa"
                                className="bg-white dark:bg-zinc-800 dark:text-white"
                                placeholder="ABC1A23"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Tipo de veículo</Label>
                              <Select>
                                <SelectTrigger className="dark:bg-zinc-800 dark:text-white">
                                  <SelectValue placeholder="Tipo de veículo" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-zinc-800 dark:text-white">
                                  <SelectItem value="carro">Carro</SelectItem>
                                  <SelectItem value="moto">Moto</SelectItem>
                                  <SelectItem value="caminhão">
                                    Caminhão
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                              <Button
                                variant="outline"
                                className="cursor-pointer"
                              >
                                Cancelar
                              </Button>
                              <Button className="cursor-pointer">Salvar</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </DialogPortal>
                    </Dialog>

                    {/*===============Ativar/Desativar=============== */}

                    <Button
                      size="sm"
                      variant="outline"
                      className={
                        item.ativo
                          ? "text-blue-500 border-blue-500 cursor-pointer"
                          : "text-destructive border-destructive cursor-pointer"
                      }
                    >
                      {item.ativo ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </Button>

                    {/*======================Excluir================== */}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(item.id)}
                          className="text-destructive border-destructive cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white/90 dark:bg-gray-900/90 p-6 shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                        <DialogHeader>
                          <DialogTitle>Confirmar exclusão</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <p>
                            Tem certeza que deseja excluir este
                            microcontrolador?
                          </p>
                          <div className="flex justify-end gap-2">
                            <Button
                              className="cursor-pointer"
                              variant="outline"
                            >
                              Cancelar
                            </Button>
                            <Button
                              onClick={confirmDelete}
                              disabled={isDeleting}
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MicrocontrollersPage;
