"use client";

import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, UserRoles } from "@/domain/users/user.model";
import {
  AdminCreatesUserSchema,
  adminCreatesUserSchema,
} from "@/schemas/user.schema";
import { useEffect, useTransition } from "react";
import {
  adminCreateUserAction,
  adminUpdateUserAction,
} from "@/domain/admin/admin.actions";
import { toast } from "sonner";
import { UserStatus } from "@/generated/prisma";
import { Plus } from "lucide-react";

interface UsersDialogProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  setIsDialogOpen: (open: boolean) => void;
  isDialogOpen: boolean;
}

export function UsersDialog({
  currentUser,
  setCurrentUser,
  setIsDialogOpen,
  isDialogOpen,
}: UsersDialogProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(adminCreatesUserSchema),
  });

  useEffect(() => {
    reset({
      email: currentUser?.email || "",
      name: currentUser?.name || "",
      role: currentUser?.role || "USER",
      status: currentUser?.status || "ENABLED",
    });
  }, [currentUser, reset]);

  function onSubmit(data: AdminCreatesUserSchema) {
    startTransition(async () => {
      const result = await (currentUser
        ? adminUpdateUserAction(currentUser.id, data)
        : adminCreateUserAction(data));

      if (result.error) {
        toast.error(
          currentUser ? "Erro ao atualizar usuário" : "Erro ao criar usuário"
        );
        return;
      }

      setTimeout(() => {
        setCurrentUser(null);
        setIsDialogOpen(false);

        toast.success(
          currentUser
            ? "Usuário atualizado com sucesso"
            : "Usuário criado com sucesso"
        );
      }, 600);
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
    >
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);

          reset({
            email: currentUser?.email || "",
            name: currentUser?.name || "",
            role: currentUser?.role || "USER",
            status: currentUser?.status || "ENABLED",
          });

          setTimeout(() => {
            setCurrentUser(null);
          }, 600);
        }}
      >
        <DialogTrigger asChild>
          <Button className="gap-2 mt-4">
            <Plus className="h-4 w-4" />
            Adicionar Usuário
          </Button>
        </DialogTrigger>
        <DialogContent aria-describedby="user-dialog">
          <DialogHeader>
            <DialogTitle>
              {currentUser ? "Editar Usuário" : "Adicionar Novo Usuário"}
            </DialogTitle>
            <DialogDescription>
              {currentUser
                ? "Atualize os dados do usuário selecionado."
                : "Preencha os dados para adicionar um novo usuário ao sistema."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  {...register("name")}
                  id="name"
                  placeholder="Nome completo"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Cargo</Label>

                <Select
                  value={watch("role")}
                  onValueChange={(value) =>
                    setValue("role", value as UserRoles)
                  }
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione o Cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Usuário</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(value) =>
                    setValue("status", value as UserStatus)
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENABLED">Ativo</SelectItem>
                    <SelectItem value="DISABLED">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <input type="hidden" value="user" />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                type="button"
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : "Confirmar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
