"use client";

import { useState } from "react";
import { db } from "@/lib/adapters/firebase.adapter";
import { getAuth } from "firebase/auth";
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

// zod <> React Hook Form
import { z } from "zod";
import { useForm } from "react-hook-form";

// Ensure 'reset' is available from useForm

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/@types/user";
import { FirebaseError } from "firebase/app";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type tipos = "carro" | "moto" | "caminhão";
export type chips = "VIVO" | "CLARO" | "TIM";
export type modelos = "Raster1" | "Raster2";
export type roles = "ADMIN" | "USER";

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
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userRole] = useState<"ADMIN" | "USER" | null>(null);

  const randomName = `Micro_${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`.substring(0, 10);

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
      const auth = getAuth();
      const currentUser = auth.currentUser;
      console.log("currentUser:", currentUser);
      if (!currentUser) {
        toast.error("Usuário não autenticado. Faça login novamente.");
        throw new Error("Usuário não autenticado");
      }
      // Busca o papel do usuário diretamente do Firestore
      const userSnap = await getDoc(doc(db, "users", currentUser.uid));
      let userRole = userSnap.exists() ? userSnap.data().role : "USER";
      console.log("userRole dentro da mutation:", userRole);

      if (!userRole || userRole === "USER") {
        await new Promise((res) => setTimeout(res, 2000));
        const retrySnap = await getDoc(doc(db, "users", currentUser.uid));
        userRole = retrySnap.exists() ? retrySnap.data().role : "USER";
      }
      const microRef = collection(db, "microcontrollers");

      let q;
      if (userRole === "ADMIN") {
        q = microRef; // Admin vê todos
      } else {
        q = query(microRef, where("userId", "==", currentUser.uid)); // User vê só os dele
      }

      const snapshot = await getDocs(q);
      console.log(snapshot.docs.map((doc) => doc.data()));
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Microcontroller),
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
      const auth = getAuth();
      const currentUser = auth.currentUser;
      // Obter o ID do usuário autenticado

      if (!currentUser) {
        console.log("Usuário não autenticado", currentUser);
        throw new Error("Usuário não autenticado");
      }
      const userId = currentUser.uid;
      console.log("currentUser:", currentUser);

      console.log("userRole:", userRole);

      // Verifica se já existe um microcontrolador com o mesmo mac_address ou placa
      const microRef = collection(db, "microcontrollers");
      const macQuery = query(microRef, where("mac_address", "==", mac_address));
      const placaQuery = query(microRef, where("placa", "==", placa));

      const [macSnapshot, placaSnapshot] = await Promise.all([
        getDocs(macQuery),
        getDocs(placaQuery),
      ]);

      // Se encontrar um documento com o mesmo mac_address ou placa, lança um erro
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
        // Se estiver editando, verifica se o documento encontrado não é o atual
        if (!macSnapshot.empty && macSnapshot.docs[0].id !== currentMicro.id) {
          throw new Error(
            "Já existe um microcontrolador com este MAC Address."
          );
        }
        if (
          !placaSnapshot.empty &&
          placaSnapshot.docs[0].id !== currentMicro.id
        ) {
          throw new Error("Já existe um microcontrolador com esta placa.");
        }
      }

      if (currentMicro) {
        // Atualiza o microcontrolador existente
        const updateMicro = {
          nome,
          mac_address,
          modelo,
          chip,
          placa,
          tipo,
          updatedAt: new Date().toISOString(),
        };
        await updateDoc(
          doc(db, "microcontrollers", currentMicro.id!),
          updateMicro
        );
        return;
      }

      // Cria um novo microcontrolador com o ID do usuário
      const newMicro = {
        nome,
        mac_address,
        modelo,
        chip,
        placa,
        tipo,
        ativo: true,
        userId, // Adiciona o ID do usuário
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDoc(microRef, newMicro);
      console.log("Microcontrolador criado com sucesso", currentUser);
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

  {
    /*===================================== DELETAR ================================== */
  }

  //Pega o ID do microcontrolador a ser deletado e abre o dialog de confirmação
  const handleDelete = (userId: string) => {
    setmicroToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  // Fecha o dialog de confirmação e apaga o microcontrolador
  const confirmDelete = async () => {
    if (!microToDelete) return;

    setIsDeleting(true);
    try {
      const userRef = doc(db, "microcontrollers", microToDelete);
      await deleteDoc(userRef);

      setIsDeleteDialogOpen(false);
      toast.success("O microcontrolador foi apagado com sucesso");
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

  const toggleMicroStatus = async (microId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const microRef = doc(db, "microcontrollers", microId);

    try {
      // 1. Cancelar queries ativas
      await queryClient.cancelQueries({ queryKey: ["microcontrollers"] });

      // 3. Atualização otimista
      queryClient.setQueryData(
        ["microcontrollers"],
        (old: Microcontroller[] | undefined) =>
          old?.map((micro) =>
            micro.id === microId ? { ...micro, ativo: newStatus } : micro
          ) || []
      );

      // 4. Atualização real no Firestore
      await updateDoc(microRef, { ativo: newStatus });

      // 5. Feedback visual
      toast.success(
        `Microcontrolador ${newStatus ? "ativado" : "desativado"} com sucesso!`
      );
    } catch (error) {
      // 6. Rollback em caso de erro
      const previousMicros = queryClient.getQueryData<Microcontroller[]>([
        "microcontrollers",
      ]);
      if (previousMicros) {
        queryClient.setQueryData(["microcontrollers"], previousMicros);
      }
      toast.error("Falha ao atualizar status");
      console.error("Erro:", error);
    } finally {
      // 7. Sincronizar com servidor
      queryClient.invalidateQueries({ queryKey: ["microcontrollers"] });
    }
  };

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

      <div className="mb-4">
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              reset();
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
                  nome: res.data ?? "",
                  mac_address: "",
                  modelo: "Raster1",
                  chip: "VIVO",
                  placa: "",
                  tipo: "carro",
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
                createEditMicroMutation.mutate(data)
              )}
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
                  <Input {...register("nome")} id="nome" className="bg-card" />
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
                  <Select
                    onValueChange={(value: modelos) =>
                      setValue("modelo", value)
                    }
                    value={watch("modelo")}
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
                    onValueChange={(value: chips) => setValue("chip", value)}
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
                  <Select
                    onValueChange={(value: tipos) => setValue("tipo", value)}
                    value={watch("tipo")}
                  >
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Tipo de veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carro">Carro</SelectItem>
                      <SelectItem value="moto">Moto</SelectItem>
                      <SelectItem value="caminhao">Caminhão</SelectItem>
                    </SelectContent>
                  </Select>
                  {<p className="text-sm text-destructive">{}</p>}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    onClick={() => setIsDialogOpen(false)}
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
      </div>

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

      <div className="border rounded-lg p-4 bg-card h-screen overflow-auto">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Lista de microcontroladores</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Microcontroladores cadastrados
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
                          onClick={() => {
                            setCurrentMicro(item);
                            setIsDialogOpen(true);
                            reset({
                              nome: item.nome,
                              mac_address: item.mac_address,
                              modelo: item.modelo,
                              chip: item.chip,
                              placa: item.placa,
                              tipo: item.tipo,
                            });
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                    {/*===============Ativar/Desativar=============== */}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleMicroStatus(item.id, item.ativo)}
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
                              className="cursor-pointer"
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
