"use client";

import { useState } from "react";
import { db } from "@/lib/adapters/firebase.adapter";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { motion } from "framer-motion";
import {
  Filter,
  LoaderCircle,
  MoreHorizontal,
  Plus,
  Trash,
  UserCog,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// zod <> React Hook Form
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/@types/user";
import { FirebaseError } from "firebase/app";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { query } from "@/providers/client-provider";
import { deleteOnFireAuth } from "./actions";

export type UserRoles = "USER" | "ADMIN";
export type UserStatus = "ENABLED" | "DISABLED";

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  role: z.enum(["USER", "ADMIN"]),
  password: z.string(),
  status: z.enum(["ENABLED", "DISABLED"]),
});

export type TCreateUserSchema = z.infer<typeof createUserSchema>;

export default function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const {
    register,
    formState: { errors },
    setValue,
    reset,
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: currentUser?.email || "",
      name: currentUser?.name || "",
      password: "raster-password",
      role: currentUser?.role || ("USER" as UserRoles),
      status: currentUser?.status || ("ENABLED" as UserStatus),
    },
  });

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "users"));
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        uid: doc.data().uid || doc.id,
        name: doc.data().name || doc.data().nome || "",
        email: doc.data().email || "",
        status: doc.data().status || "ENABLED",
        role: doc.data().role || "USER",
        createdAt: doc.data().createdAt || "",
        updatedAt: doc.data().updatedAt || "",
      }));
    },
  });

  const createEditUserMutation = useMutation<
    void,
    FirebaseError,
    TCreateUserSchema
  >({
    mutationFn: async (data) => {
      const { email, name, password, role, status } = data;

      if (currentUser) {
        const updatedUser = {
          name,
          email,
          role,
          status,
          updatedAt: new Date().toISOString(),
        };

        await updateDoc(doc(db, "users", currentUser.id), updatedUser);
        return;
      }

      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      const userCreated = {
        name,
        email,
        role,
        status,
        uid: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };

      await setDoc(doc(db, "users", user.uid), userCreated);
    },
    onSuccess: () => {
      toast.success(
        currentUser
          ? `Usuário ${currentUser.name} atualizado com sucesso`
          : "Usuário criado com sucesso"
      );
      setIsDialogOpen(false);
      query.invalidateQueries({
        queryKey: ["users"],
      });
      reset();
    },
    onError: () => {
      toast.error("Não foi possível criar o usuário");
    },
  });

  //Pega o id do usuário a ser apagado e abre o dialog de confirmação
  const handleDelete = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  //Apaga o usuário do Firestore
  const confirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const userRef = doc(db, "users", userToDelete);
      await deleteDoc(userRef);

      deleteOnFireAuth(userRef.id);

      setIsDeleteDialogOpen(false);
      toast.success("O usuário foi apagado com sucesso");
      query.invalidateQueries({
        queryKey: ["users"],
      });
    } catch (error) {
      toast.error("Não foi possível apagar o usuário");
      console.error("Erro ao apagar usuário:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  {
    /*======================RETURN====================== */
  }

  return (
    <div className="container py-10 overflow-x-auto h-[calc(100vh-6rem)]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Usuários
          </span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Gerencie todos os usuários do sistema
        </p>
      </motion.div>

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

            {/* =======================FORMULARIO==================== */}

            <form
              onSubmit={handleSubmit((data) =>
                createEditUserMutation.mutate(data)
              )}
              className="mt-4 space-y-4"
            >
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
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
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
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>

                  <Select
                    onValueChange={(value: UserRoles) =>
                      setValue("role", value)
                    }
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
                <Button
                  type="submit"
                  disabled={createEditUserMutation.isPending}
                >
                  {createEditUserMutation.isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : currentUser ? (
                    "Salvar Alterações"
                  ) : (
                    "Adicionar"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg font-medium leading-none tracking-tight">
                Confirmar Exclusão
              </DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Tem certeza que deseja apagar este usuário? Esta ação não pode
                ser desfeita.
              </p>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Apagando...
                  </>
                ) : (
                  "Confirmar Exclusão"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros e Pesquisa
              </CardTitle>
              <CardDescription>
                Refine a lista de usuários usando os filtros abaixo
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Lista de Usuários
              </CardTitle>
              <CardDescription>
                {users?.length} usuários encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell>
                          <LoaderCircle className="animate-spin" />
                        </TableCell>
                      </TableRow>
                    ) : (
                      users?.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="" />
                                <AvatarFallback>
                                  {user.name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.status === "ENABLED"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setCurrentUser(user);
                                    setIsDialogOpen(true);
                                    reset({
                                      email: user.email,
                                      name: user.name,
                                      role: user.role,
                                      status: user.status,
                                      password: "raster-password",
                                    });
                                  }}
                                >
                                  <UserCog className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(user.id)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Apagar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
