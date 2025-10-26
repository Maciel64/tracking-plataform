"use client";

import {
  Activity,
  Camera,
  Clock,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Save,
  User as UserIcon,
} from "lucide-react";

import * as motion from "motion/react-client";
import type { User } from "next-auth";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { item } from "@/lib/motion";

// Schema de validação para o formulário principal

export function PerfilPage({ user }: { user: User }) {
  const [isLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formData] = useState({
    nome: user.name,
    email: user.email,
  });
  const [formErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {},
  );
  const [accessHistory] = useState<
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

  const handleChange = () => {};

  const handlePasswordChange = () => {};

  const handleSubmit = async () => {};

  const handlePasswordSubmit = async () => {};

  function toggleTwoFactorAuth(checked: boolean): void {
    setTwoFactorEnabled(checked);
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
                      <UserIcon className="h-5 w-5" />
                      Foto de Perfil
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center space-y-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage
                        src={
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                        }
                        alt="Foto de perfil"
                      />
                      <AvatarFallback className="text-4xl">
                        {user.name?.slice(0, 2)}
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
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          IP:
                        </span>
                        <span>{user.id || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Dispositivo:
                        </span>
                        <span>{user?.name || "N/A"}</span>
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
                          name="nome"
                          value={formData.nome || ""}
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
                          name="email"
                          type="email"
                          value={formData.email || ""}
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
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biografia</Label>
                      <Textarea
                        name="bio"
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
                        <p className="text-sm text-muted-foreground"></p>
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
