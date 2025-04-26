"use client";

import { useState } from "react";
import { db } from "@/lib/adapters/firebase.adapter";
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  getDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Cpu, Filter, Pencil } from "lucide-react";
import { Trash2 } from "lucide-react";
import { CheckCircle, XCircle } from "lucide-react";
import { MicrocontrollersForm } from "./form";
import { Microcontroller } from "@/@types/microcontroller";
import { Badge } from "@/components/ui/badge";

function MicrocontrollersPage() {
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMicro, setCurrentMicro] = useState<Microcontroller | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [microToDelete, setmicroToDelete] = useState<string | null>(null);

  const { data: microcontrollers } = useQuery({
    queryKey: ["microcontrollers"],
    queryFn: async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        toast.error("Usuário não autenticado. Faça login novamente.");
        throw new Error("Usuário não autenticado");
      }
      const userSnap = await getDoc(doc(db, "users", currentUser.uid));
      let userRole = userSnap.exists() ? userSnap.data().role : "USER";

      if (!userRole || userRole === "USER") {
        await new Promise((res) => setTimeout(res, 2000));
        const retrySnap = await getDoc(doc(db, "users", currentUser.uid));
        userRole = retrySnap.exists() ? retrySnap.data().role : "USER";
      }
      const microRef = collection(db, "microcontrollers");

      let q;
      if (userRole === "ADMIN") {
        q = microRef;
      } else {
        q = query(microRef, where("user_id", "==", currentUser.uid));
      }

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as Microcontroller[];
    },
  });

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
      await queryClient.cancelQueries({ queryKey: ["microcontrollers"] });

      await updateDoc(microRef, { active: newStatus });

      queryClient.invalidateQueries({
        queryKey: ["microcontrollers"],
      });

      toast.success(
        `Microcontrolador ${newStatus ? "ativado" : "desativado"} com sucesso!`
      );
    } catch (error) {
      const previousMicros = queryClient.getQueryData<Microcontroller[]>([
        "microcontrollers",
      ]);
      if (previousMicros) {
        queryClient.setQueryData(["microcontrollers"], previousMicros);
      }
      toast.error("Falha ao atualizar status");
      console.error("Erro:", error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["microcontrollers"] });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Microcontroladores
        </span>
      </h1>
      <p className="mt-2 text-muted-foreground pb-4">
        Gerencie todos os microcontroladores
      </p>

      <div className="mb-4">
        <MicrocontrollersForm
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          currentMicro={currentMicro}
          setCurrentMicro={setCurrentMicro}
        />
      </div>

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

      <div className="border rounded-lg p-4 bg-card overflow-auto">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Lista de microcontroladores</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Microcontroladores cadastrados
        </p>

        <Table className="w-full text-sm border">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>MAC Address</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Chip</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {microcontrollers?.map((item, index) => (
              <TableRow key={item.uid} className="border-b hover:bg-accent">
                <TableCell className="p-2">{index + 1}</TableCell>
                <TableCell className="p-2">{item.name}</TableCell>
                <TableCell className="p-2">{item.mac_address}</TableCell>
                <TableCell className="p-2">{item.model}</TableCell>
                <TableCell className="p-2">{item.chip}</TableCell>
                <TableCell className="p-2">{item.plate}</TableCell>
                <TableCell className="p-2">{item.type}</TableCell>
                <TableCell className="p-2">
                  <Badge variant={item.active ? "default" : "secondary"}>
                    {item.active ? "SIM" : "NÃO"}
                  </Badge>
                </TableCell>
                <TableCell className="p-2 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-primary border-primary cursor-pointer"
                        onClick={() => {
                          setCurrentMicro(item);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                  </Dialog>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleMicroStatus(item.uid, item.active)}
                    className={
                      item.active
                        ? "text-blue-500 border-blue-500 cursor-pointer"
                        : "text-destructive border-destructive cursor-pointer"
                    }
                  >
                    {item.active ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                  </Button>

                  <Dialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item.uid)}
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
                          Tem certeza que deseja excluir este microcontrolador?
                        </p>
                        <div className="flex justify-end gap-2">
                          <Button className="cursor-pointer" variant="outline">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default MicrocontrollersPage;
