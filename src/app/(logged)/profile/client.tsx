"use client";

import { useState } from "react";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import * as motion from "motion/react-client";
import {
  Camera,
  Mail,
  Save,
  User,
  Lock,
  Clock,
  Activity,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User as TUser } from "@/@types/user";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth, db } from "@/lib/adapters/firebase.adapter";
import { z } from "zod";
import { FirebaseError } from "firebase/app";

// Schema de validação para o formulário principal
const userFormSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
  cargo: z.string(),
  bio: z
    .string()
    .max(200, "A biografia deve ter no máximo 200 caracteres")
    .optional(),
});

// Schema de validação para a alteração de senha
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "A senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(8, "A nova senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export function PerfilPage({ user }: { user: TUser }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    user.twoFactorEnabled || false
  );
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formData, setFormData] = useState({
    nome: user.name,
    email: user.email,
    telefone: user.telefone || "",
    cargo: user.role,
    bio: user.bio || "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );
  const [accessHistory, setAccessHistory] = useState<
    Array<{
      id: string;
      date: string;
      ip: string;
      action: string;
      device: string;
    }>
  >([]);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Função para buscar o histórico de acessos usando query
  const fetchAccessHistory = async () => {
    try {
      if (!user?.email) return;

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        setAccessHistory(docData.accessHistory || []);
      } else {
        console.warn("Nenhum usuário encontrado com esse e-mail.");
      }
    } catch (error) {
      console.error("Erro ao buscar histórico de acesso:", error);
    }
  };

  // Executa a busca do histórico direto
  fetchAccessHistory();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    if (passwordErrors[name]) {
      setPasswordErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = userFormSchema.parse(formData);

      if (twoFactorEnabled) {
        const code = prompt(
          "Por favor, insira o código de autenticação de dois fatores:"
        );

        if (!code) {
          toast.error("Código de autenticação não fornecido.");
          setIsLoading(false);
          return;
        }

        const isValidCode = true;

        if (!isValidCode) {
          toast.error("Código de autenticação inválido.");
          setIsLoading(false);
          return;
        }
      }

      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, {
          name: validatedData.nome,
          email: validatedData.email,
          telefone: validatedData.telefone,
          bio: validatedData.bio,
          twoFactorEnabled: twoFactorEnabled,
        });

        toast.success("Perfil atualizado com sucesso");
      } else {
        toast.error("Usuário não autenticado");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errorMap[err.path[0]] = err.message;
          }
        });
        setFormErrors(errorMap);
        toast.error("Verifique os campos destacados");
      } else {
        console.error("Erro ao atualizar perfil:", error);
        toast.error("Erro ao atualizar perfil");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (
    e: React.FormEvent | React.MouseEvent
  ) => {
    if ("preventDefault" in e) {
      e.preventDefault();
    }

    try {
      const validatedPasswordData = passwordSchema.parse(passwordData);
      setIsLoading(true);
      const currentUser = auth.currentUser;

      if (!currentUser || !currentUser.email) {
        toast.error("Usuário não autenticado");
        return;
      }

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        validatedPasswordData.currentPassword
      );

      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, validatedPasswordData.newPassword);

      toast.success("Senha alterada com sucesso, faça login novamente");
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errorMap[err.path[0]] = err.message;
          }
        });
        setPasswordErrors(errorMap);
      } else if (error instanceof FirebaseError) {
        // Use o tipo correto para erros do Firebase
        if (error.code === "auth/wrong-password") {
          setPasswordErrors({ currentPassword: "Senha atual incorreta" });
          toast.error("Senha atual incorreta");
        } else if (error.code === "auth/requires-recent-login") {
          toast.error(
            "Por segurança, faça login novamente antes de alterar a senha"
          );
        } else {
          console.error("Erro ao alterar senha:", error);
          toast.error("Erro ao alterar senha: tente novamente mais tarde");
        }
      } else {
        console.error("Erro inesperado ao alterar senha:", error);
        toast.error("Erro ao alterar senha: tente novamente mais tarde");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  function toggleTwoFactorAuth(checked: boolean): void {
    setTwoFactorEnabled(checked);
    // Aqui você implementaria a lógica de ativar/desativar 2FA
  }

  return (
    <div className="container min-h-screen h-[calc(100vh-6rem)] w-full py-10 overflow-y-auto px-4 md:px-8 lg:px-12 ">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Meu Perfil
          </span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Altere suas informações de perfil e configurações de segurança
        </p>
      </motion.div>
      <motion.div initial="hidden" animate="show">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
            {/* Coluna esquerda - Avatar e Segurança */}
            <div className="space-y-6">
              <motion.div variants={item}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Foto de Perfil
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center space-y-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage
                        src={user.photoURL || "/placeholder.svg"}
                        alt="Foto de perfil"
                      />
                      <AvatarFallback className="text-4xl">
                        {user.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" className="w-full gap-2">
                      <Camera className="h-4 w-4" />
                      Alterar Foto
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={item}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Segurança
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col space-y-6">
                      <div className="flex items-center justify-between space-x-4">
                        <div>
                          <Label htmlFor="two-factor">
                            Autenticação em dois fatores
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {twoFactorEnabled
                              ? "Ativada - Mais segurança para sua conta"
                              : "Desativada - Recomendamos ativar"}
                          </p>
                        </div>
                        <Switch
                          id="two-factor"
                          checked={twoFactorEnabled}
                          onCheckedChange={toggleTwoFactorAuth}
                        />
                      </div>
                      <Separator />
                      {!isChangingPassword ? (
                        <Button
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => setIsChangingPassword(true)}
                        >
                          <Lock className="h-4 w-4" />
                          Alterar Senha
                        </Button>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Senha Atual</Label>
                            <div className="relative">
                              <Input
                                id="currentPassword"
                                name="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                                className={
                                  passwordErrors.currentPassword
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() =>
                                  setShowCurrentPassword(!showCurrentPassword)
                                }
                              >
                                {showCurrentPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="sr-only">
                                  {showCurrentPassword
                                    ? "Ocultar senha"
                                    : "Mostrar senha"}
                                </span>
                              </Button>
                            </div>
                            {passwordErrors.currentPassword && (
                              <p className="text-sm text-red-500">
                                {passwordErrors.currentPassword}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">Nova Senha</Label>
                            <div className="relative">
                              <Input
                                id="newPassword"
                                name="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                                className={
                                  passwordErrors.newPassword
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() =>
                                  setShowNewPassword(!showNewPassword)
                                }
                              >
                                {showNewPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="sr-only">
                                  {showNewPassword
                                    ? "Ocultar senha"
                                    : "Mostrar senha"}
                                </span>
                              </Button>
                            </div>
                            {passwordErrors.newPassword && (
                              <p className="text-sm text-red-500">
                                {passwordErrors.newPassword}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                              Confirmar Nova Senha
                            </Label>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                                className={
                                  passwordErrors.confirmPassword
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="sr-only">
                                  {showConfirmPassword
                                    ? "Ocultar senha"
                                    : "Mostrar senha"}
                                </span>
                              </Button>
                            </div>
                            {passwordErrors.confirmPassword && (
                              <p className="text-sm text-red-500">
                                {passwordErrors.confirmPassword}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              className="gap-2"
                              disabled={isLoading}
                              onClick={handlePasswordSubmit}
                            >
                              {isLoading ? "Salvando..." : "Confirmar"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsChangingPassword(false);
                                setPasswordErrors({});
                              }}
                              disabled={isLoading}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={item}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Último Acesso
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Data/Hora:
                        </span>
                        <span>{user.lastLogin || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          IP:
                        </span>
                        <span>{user.lastIp || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Dispositivo:
                        </span>
                        <span>{user.lastDevice || "N/A"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            {/* Coluna direita - Informações pessoais e histórico */}
            <div className="space-y-6">
              <motion.div variants={item}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Informações Pessoais
                    </CardTitle>
                    <CardDescription>
                      Atualize suas informações de perfil
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input
                          id="nome"
                          name="nome"
                          value={formData.nome}
                          onChange={handleChange}
                          required
                          className={formErrors.nome ? "border-red-500" : ""}
                        />
                        {formErrors.nome && (
                          <p className="text-sm text-red-500">
                            {formErrors.nome}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className={formErrors.email ? "border-red-500" : ""}
                        />
                        {formErrors.email && (
                          <p className="text-sm text-red-500">
                            {formErrors.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          name="telefone"
                          value={formData.telefone}
                          onChange={handleChange}
                          placeholder="(99) 99999-9999"
                          className={
                            formErrors.telefone ? "border-red-500" : ""
                          }
                        />
                        {formErrors.telefone && (
                          <p className="text-sm text-red-500">
                            {formErrors.telefone}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cargo">Cargo</Label>
                        <Input
                          id="cargo"
                          name="cargo"
                          value={formData.cargo}
                          onChange={handleChange}
                          readOnly
                          className="bg-muted cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biografia</Label>
                      <Textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Conte um pouco sobre você..."
                        className={`resize-none ${
                          formErrors.bio ? "border-red-500" : ""
                        }`}
                        maxLength={200}
                      />
                      {formErrors.bio ? (
                        <p className="text-sm text-red-500">{formErrors.bio}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {formData.bio.length}/200 caracteres
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="ml-auto gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>Salvando...</>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
              <motion.div variants={item}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Histórico de Acessos
                    </CardTitle>
                    <CardDescription>
                      Registro das últimas atividades na sua conta
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {accessHistory.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data/Hora</TableHead>
                            <TableHead>Ação</TableHead>
                            <TableHead>IP</TableHead>
                            <TableHead>Dispositivo</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {accessHistory.map((access) => (
                            <TableRow key={access.id}>
                              <TableCell>{access.date}</TableCell>
                              <TableCell>{access.action}</TableCell>
                              <TableCell>{access.ip}</TableCell>
                              <TableCell>{access.device}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        Nenhum registro de acesso encontrado
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
