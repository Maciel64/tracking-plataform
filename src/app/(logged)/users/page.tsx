"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/adapters/firebase.adapter";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { motion } from "framer-motion";
import {
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
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

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [departamentoFilter, setDepartamentoFilter] = useState("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Form states
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [status, setStatus] = useState("ativo");

  const fetchUsuarios = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const listaUsuarios = snapshot.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome || "",
        email: doc.data().email || "",
        cargo: doc.data().cargo || "",
        departamento: doc.data().departamento || "",
        status: doc.data().status || "ativo",
        createdAt: doc.data().createdAt || "",
        updatedAt: doc.data().updatedAt || "",
      }));
      setUsuarios(listaUsuarios);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const resetForm = () => {
    setNome("");
    setEmail("");
    setCargo("");
    setDepartamento("");
    setStatus("ativo");
    setCurrentUser(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!email.trim()) newErrors.email = "Email é obrigatório";
    if (!cargo.trim()) newErrors.cargo = "Cargo é obrigatório";
    if (!departamento) newErrors.departamento = "Departamento é obrigatório";

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (currentUser) {
        await updateDoc(doc(db, "users", currentUser.id), {
          nome,
          email,
          cargo,
          departamento,
          status,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await addDoc(collection(db, "users"), {
          nome,
          email,
          cargo,
          departamento,
          status,
          createdAt: new Date().toISOString(),
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchUsuarios();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      setErrors({ submit: "Erro ao salvar usuário. Tente novamente." });
    }
  };

  const handleEdit = (usuario: any) => {
    setCurrentUser(usuario);
    setNome(usuario.nome);
    setEmail(usuario.email);
    setCargo(usuario.cargo);
    setDepartamento(usuario.departamento);
    setStatus(usuario.status);
    setIsDialogOpen(true);
  };

  const handleDelete = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "users", userToDelete));
      fetchUsuarios();
    } catch (error) {
      console.error("Erro ao apagar usuário:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    switch (field) {
      case "nome":
        setNome(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "cargo":
        setCargo(value);
        break;
      case "departamento":
        setDepartamento(value);
        break;
      case "status":
        setStatus(value);
        break;
    }
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const matchesSearch =
      usuario.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.cargo?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "todos" || usuario.status === statusFilter;
    const matchesDepartamento =
      departamentoFilter === "todos" ||
      usuario.departamento?.toLowerCase() === departamentoFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesDepartamento;
  });

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

  return (
    <div className="container py-10 overflow-x-auto">
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
            if (!open) resetForm();
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
            <form onSubmit={handleSubmit} noValidate>
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
              <div className="grid gap-4 py-4">
                {errors.submit && (
                  <div className="text-red-500 text-sm">{errors.submit}</div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      placeholder="Nome completo"
                      value={nome}
                      onChange={(e) =>
                        handleFieldChange("nome", e.target.value)
                      }
                      className={errors.nome ? "border-red-500" : ""}
                      required={false}
                    />
                    {errors.nome && (
                      <p className="text-sm text-red-500">{errors.nome}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={email}
                      onChange={(e) =>
                        handleFieldChange("email", e.target.value)
                      }
                      className={errors.email ? "border-red-500" : ""}
                      required={false}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input
                      id="cargo"
                      placeholder="Cargo do usuário"
                      value={cargo}
                      onChange={(e) =>
                        handleFieldChange("cargo", e.target.value)
                      }
                      className={errors.cargo ? "border-red-500" : ""}
                      required={false}
                    />
                    {errors.cargo && (
                      <p className="text-sm text-red-500">{errors.cargo}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departamento">Departamento</Label>
                    <Select
                      value={departamento}
                      onValueChange={(value) =>
                        handleFieldChange("departamento", value)
                      }
                    >
                      <SelectTrigger
                        id="departamento"
                        className={errors.departamento ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tecnologia">Tecnologia</SelectItem>
                        <SelectItem value="produto">Produto</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="financeiro">Financeiro</SelectItem>
                        <SelectItem value="rh">RH</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.departamento && (
                      <p className="text-sm text-red-500">
                        {errors.departamento}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={status}
                    onValueChange={(value) =>
                      handleFieldChange("status", value)
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  type="button"
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {currentUser ? "Salvar Alterações" : "Adicionar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal de Confirmação de Exclusão */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja apagar este usuário? Esta ação não pode
                ser desfeita.
              </DialogDescription>
            </DialogHeader>
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
                {isDeleting ? "Apagando..." : "Confirmar Exclusão"}
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
            <CardContent>
              <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto]">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, email ou cargo..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Status</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={departamentoFilter}
                  onValueChange={setDepartamentoFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">
                      Todos os Departamentos
                    </SelectItem>
                    <SelectItem value="tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="produto">Produto</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="rh">RH</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </CardContent>
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
                {usuariosFiltrados.length} usuários encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuariosFiltrados.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={usuario.avatar} />
                              <AvatarFallback>
                                {usuario.nome?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{usuario.nome}</p>
                              <p className="text-sm text-muted-foreground">
                                {usuario.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{usuario.cargo}</TableCell>
                        <TableCell>{usuario.departamento}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              usuario.status === "ativo"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {usuario.status}
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
                                onClick={() => handleEdit(usuario)}
                              >
                                <UserCog className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(usuario.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Apagar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
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
