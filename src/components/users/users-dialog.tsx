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
import { Plus } from "lucide-react";
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
import { User, UserRoles, UserStatus } from "@/domain/users/user.model";
import {
  AdminCreatesUserSchema,
  adminCreatesUserSchema,
} from "@/schemas/user.schema";
import { useTransition } from "react";
import { adminCreateUserAction } from "@/domain/admin/admin.actions";
import { toast } from "sonner";

interface UsersDialogProps {
  currentUser: User | null;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  deletingUserId: string | null;
  setDeletingUserId: (id: string | null) => void;
}

export function UsersDialog({
  currentUser,
  isDialogOpen,
  setIsDialogOpen,
}: UsersDialogProps) {
  const {
    register,
    formState: { errors },
    setValue,
    reset,
    watch,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(adminCreatesUserSchema),
    defaultValues: {
      email: currentUser?.email || "",
      name: currentUser?.name || "",
      password: "raster-password",
      role: currentUser?.role || ("USER" as UserRoles),
      status: currentUser?.status || ("ENABLED" as UserStatus),
    },
  });

  const [isPending, startTransition] = useTransition();

  function onSubmit(data: AdminCreatesUserSchema) {
    startTransition(async () => {
      const result = await adminCreateUserAction(data);

      if (result.error) {
        toast.error("Erro ao criar usuário");
      }

      toast.success("Usuário criado com sucesso");
      setIsDialogOpen(false);
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
          if (!open) reset();
          setIsDialogOpen(open);
        }}
      >
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Usuário
          </Button>
        </DialogTrigger>
        <DialogContent>
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
                  onValueChange={(value: UserRoles) => setValue("role", value)}
                  value={watch("role")}
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
                  onValueChange={(value: UserStatus) =>
                    setValue("status", value)
                  }
                  value={watch("status")}
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
