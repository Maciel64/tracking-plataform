"use client";

import { User } from "@/@types/user";
import Map from "@/components/map";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Car,
  Shield,
  Clock,
  BarChart,
  Bell,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { CheckCircle, MapPin, Smartphone, Star, Mail } from "lucide-react";

import logo from "@/assets/images/logo.png";
import back from "@/assets/images/back.png";

import { ThemeSwitcher } from "@/components/theme-switcher"; // Ajuste o caminho
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function RasterLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data, status } = useSession();
  const { theme } = useTheme();

  const user = data?.user as User | undefined;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-[oklch(0.145_0_0)] ">
        <div className="container mx-auto max-w-7xl px-6 md:px-10 lg:px-16 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Raster Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-blue-600">RASTER</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-blue-600"
            >
              Recursos
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-blue-600"
            >
              Como Funciona
            </Link>
            <Link
              href="#clients"
              className="text-sm font-medium hover:text-blue-600"
            >
              Clientes
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium hover:text-blue-600"
            >
              Contato
            </Link>
          </nav>
          <div>
            {/* Botão do menu mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Abrir menu</span>
            </Button>
          </div>
          {status === "loading" ? (
            <div className="hidden md:flex md:gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-36 rounded-ld" />
            </div>
          ) : (
            <div className="hidden md:flex md:gap-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{user?.name?.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                asChild
                className="bg-blue-600 text-white"
              >
                <Link href={user ? "/dashboard" : "/auth/login"}>
                  {user ? "Acessar Plataforma" : "Faça Login"}
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
              <ThemeSwitcher />
            </div>
          )}
        </div>
        {mobileMenuOpen && (
          <div className="container mx-auto max-w-7xl px-6 md:px-10 lg:px-16 border-t py-4 md:hidden">
            <nav className="flex flex-col gap-4">
              <Link
                href="#features"
                className="text-sm font-medium hover:text-blue-600"
              >
                Recursos
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium hover:text-blue-600"
              >
                Como Funciona
              </Link>
              <Link
                href="#clients"
                className="text-sm font-medium hover:text-blue-600"
              >
                Clientes
              </Link>
              <Link
                href="#contact"
                className="text-sm font-medium hover:text-blue-600"
              >
                Contato
              </Link>
            </nav>

            {/* Botões de login e acesso */}
            <div className="flex flex-col gap-2 pt-4">
              <ThemeSwitcher />
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{user?.name?.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                asChild
                className="bg-blue-600 text-white"
              >
                <Link href={user ? "/dashboard" : "/auth/login"}>
                  {user ? "Acessar Plataforma" : "Faça Login"}
                </Link>
              </Button>
            </div>

            {/* Botão de Fechar Menu (X) */}
            <div className="flex justify-center pt-4">
              <button
                className="p-2 rounded-md border border-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <section className="relative py-16 md:py-24">
          <div className="absolute inset-0 z-0">
            <Image
              src={back} // Caminho corrigido
              alt="Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="container relative z-10 mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl">
                    Rastreamento veicular em tempo real
                  </h1>
                  <p className="max-w-[600px] text-gray-200 md:text-xl">
                    Monitore sua frota com precisão e segurança. Soluções
                    completas de rastreamento para empresas e particulares.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    Solicitar Demonstração
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Saiba Mais
                  </Button>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="inline-block h-8 w-8 overflow-hidden rounded-full border-2 border-white"
                      >
                        <Image
                          src={`/placeholder.svg?height=32&width=32&text=${i}`}
                          width={32}
                          height={32}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-200">
                    Mais de{" "}
                    <span className="font-medium text-blue-300">2,000+</span>{" "}
                    clientes satisfeitos
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-full max-w-[500px] overflow-hidden rounded-lg shadow-xl">
                  <Map className="z-0" showZoomControls={false} />
                  <div className="z-10 absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
                  <div className="z-10 absolute bottom-4 left-4 right-4 rounded-lg bg-white/90 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <Car className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          Veículo em movimento
                        </p>
                        <p className="font-medium text-blue-600">
                          Caminhão 2 - Rota SP-RJ
                        </p>
                      </div>
                      <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                        <ChevronRight className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="space-y-2 ">
                <h2
                  className={cn(
                    "text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl ",
                    theme == "light" ? "text-blue-800" : "text-white"
                  )}
                >
                  Recursos Avançados
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Nossa plataforma oferece as melhores soluções de rastreamento
                  do mercado
                </p>
              </div>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-blue-100">
                <CardContent className="flex flex-col items-center gap-2 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Image
                      src={logo}
                      alt="Raster Logo"
                      width={24}
                      height={24}
                      className="h-6 w-auto"
                    />
                  </div>
                  <h3 className="text-xl font-bold">
                    Localização em Tempo Real
                  </h3>
                  <p className="text-center text-gray-500">
                    Acompanhe a localização exata dos seus veículos em tempo
                    real com atualizações a cada 30 segundos.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardContent className="flex flex-col items-center gap-2 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold">Segurança Avançada</h3>
                  <p className="text-center text-gray-500">
                    Bloqueio remoto do veículo e alertas de segurança para
                    proteção contra roubo e uso não autorizado.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardContent className="flex flex-col items-center gap-2 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold">Histórico de Rotas</h3>
                  <p className="text-center text-gray-500">
                    Acesse o histórico completo de rotas e paradas dos seus
                    veículos por até 90 dias.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardContent className="flex flex-col items-center gap-2 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <BarChart className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold">Relatórios Detalhados</h3>
                  <p className="text-center text-gray-500">
                    Relatórios personalizados de quilometragem, consumo de
                    combustível e comportamento do motorista.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardContent className="flex flex-col items-center gap-2 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Bell className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold">Alertas Personalizados</h3>
                  <p className="text-center text-gray-500">
                    Configure alertas para excesso de velocidade, saída de rota,
                    paradas não programadas e muito mais.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardContent className="flex flex-col items-center gap-2 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold">Gestão de Frota</h3>
                  <p className="text-center text-gray-500">
                    Gerencie toda sua frota em uma única plataforma, com
                    controle de manutenção e documentação.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-blue-50 py-16 md:py-24">
          <div className="container mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-blue-900 sm:text-4xl md:text-5xl">
                  Como Funciona
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Implementação simples e rápida para começar a rastrear seus
                  veículos
                </p>
              </div>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                  <span className="text-xl font-bold">1</span>
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="text-xl font-bold text-blue-900">
                    Instalação do Rastreador
                  </h3>
                  <p className="text-gray-500">
                    Nossos técnicos instalam o dispositivo de rastreamento em
                    seu veículo em menos de 1 hora.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                  <span className="text-xl font-bold">2</span>
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="text-xl font-bold text-blue-900">
                    Configuração da Plataforma
                  </h3>
                  <p className="text-gray-500">
                    Configure sua conta e personalize as configurações de acordo
                    com suas necessidades.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                  <span className="text-xl font-bold">3</span>
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="text-xl font-bold text-blue-900">
                    Monitoramento em Tempo Real
                  </h3>
                  <p className="text-gray-500">
                    Comece a monitorar seus veículos pelo aplicativo ou
                    plataforma web imediatamente.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-12 flex justify-center">
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Agendar Instalação
              </Button>
            </div>
          </div>
        </section>

        {/* Clients Section */}
        <section id="clients" className="py-16 md:py-24">
          <div className="container mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="space-y-2">
                <h2
                  className={cn(
                    "text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[--chart-2]",
                    theme == "light" ? "text-blue-800" : ""
                  )}
                >
                  Nossos Clientes
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Empresas que confiam na Raster para rastreamento veicular
                </p>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center justify-center">
                  <Image
                    src={`/placeholder.svg?height=60&width=120&text=Cliente+${i}`}
                    width={120}
                    height={60}
                    alt={`Cliente ${i}`}
                    className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
            <div className="mt-16 rounded-lg bg-blue-600 p-8 md:p-10">
              <div className="grid gap-6 md:grid-cols-2 md:gap-10">
                <div>
                  <blockquote className="text-lg font-medium text-white md:text-xl">
                    &quot;A Raster transformou completamente a gestão da nossa
                    frota. Conseguimos reduzir custos operacionais em 30% e
                    melhorar a eficiência das nossas entregas.&quot;
                  </blockquote>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-white/20">
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        width={40}
                        height={40}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-white">Carlos Silva</p>
                      <p className="text-sm text-blue-100">
                        Diretor de Logística, Transportadora Express
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <blockquote className="text-lg font-medium text-white md:text-xl">
                    &quot;O sistema de alertas da Raster nos ajudou a melhorar a
                    segurança da nossa frota e reduzir significativamente os
                    incidentes nas estradas.&quot;
                  </blockquote>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-white/20">
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        width={40}
                        height={40}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-white">Ana Oliveira</p>
                      <p className="text-sm text-blue-100">
                        Gerente de Operações, Distribuidora Nacional
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA / Contato - Design melhorado */}
        <section
          id="contact"
          className="relative py-16 md:py-24 overflow-hidden"
        >
          {/* Fundo com gradiente e elementos decorativos */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
            {/* Elementos decorativos */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-700 opacity-10 blur-3xl"></div>
              <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-blue-600 opacity-10 blur-3xl"></div>
              <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-blue-500 opacity-10 blur-3xl"></div>

              {/* Padrão de grade */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              ></div>
            </div>
          </div>

          <div className="container relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Coluna de texto */}
                <div className="text-white">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                    Vamos conversar?
                  </h2>
                  <p className="text-blue-100 mb-6">
                    Entre em contato conosco e descubra como o Raster pode
                    trazer mais segurança e tranquilidade para você e sua frota.
                  </p>

                  <div className="space-y-6 mt-8">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-800/50 p-3 rounded-full">
                        <MapPin className="h-5 w-5 text-blue-200" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Endereço</h3>
                        <p className="text-blue-200">
                          Av. Paulista, 1000 - São Paulo, SP
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-800/50 p-3 rounded-full">
                        <Smartphone className="h-5 w-5 text-blue-200" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Telefone</h3>
                        <p className="text-blue-200">(11) 3456-7890</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-blue-800/50 p-3 rounded-full">
                        <Mail className="h-5 w-5 text-blue-200" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Email</h3>
                        <p className="text-blue-200">lucassa1324@gmail.com</p>
                        <p className="text-blue-200">
                          macielsuassuna14@gmail.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/*------FORMULARIO -------*/}

                <div className="flex items-center ">
                  <Card
                    className={cn(
                      "w-full max-w-md border-blue-100 bg-background ",
                      theme == "light" ? "bg-white" : "bg-black"
                    )}
                  >
                    <CardContent className="p-6">
                      <form className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label
                              htmlFor="name"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Nome
                            </label>
                            <input
                              id="name"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Seu nome"
                            />
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="company"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Empresa
                            </label>
                            <input
                              id="company"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Sua empresa"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="seu@email.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="phone"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Telefone
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="(00) 00000-0000"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="vehicles"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Quantidade de Veículos
                          </label>
                          <select
                            id="vehicles"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Selecione</option>
                            <option value="1-5">1-5</option>
                            <option value="6-20">6-20</option>
                            <option value="21-50">21-50</option>
                            <option value="51+">51+</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="message"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Mensagem
                          </label>
                          <textarea
                            id="message"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Como podemos ajudar?"
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Enviar Mensagem
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                <Button className="bg-white text-blue-900 hover:bg-blue-50 h-12 px-8 text-base">
                  Fale Conosco
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-blue-800 h-12 px-8 text-base"
                >
                  Agendar Demonstração
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-blue-950 text-blue-200 py-8 sm:py-12">
        <div className="container mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src={logo}
                  alt="Raster Logo"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                />
                <span className="text-xl font-bold text-white">Raster</span>
              </div>
              <p className="text-blue-300 mb-4">
                Soluções avançadas de rastreamento veicular para sua segurança e
                tranquilidade.
              </p>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-white"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="#"
                  className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-white"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4 9 4c0-2-2-3.4-1-4.5C19 1.5 22 .8 22 4Z"></path>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link
                  href="#"
                  className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-white"
                  >
                    <rect
                      width="20"
                      height="20"
                      x="2"
                      y="2"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  href="#"
                  className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-white"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-white mb-4">Empresa</h3>
              <ul className="space-y-2">
                {[
                  "Sobre nós",
                  "Carreiras",
                  "Blog",
                  "Parceiros",
                  "Imprensa",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-white mb-4">Recursos</h3>
              <ul className="space-y-2">
                {[
                  "Rastreamento",
                  "Segurança",
                  "Aplicativo",
                  "Gestão de Frota",
                  "Suporte",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-white mb-4">Contato</h3>
              <ul className="space-y-2">
                <li>lucassa1324@gmail.com</li>
                <li>macielsuassuna14@gmail.com</li>
                <li>(83) 981448111</li>
                <li>Av. Paulista, 1000 - São Paulo, SP</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs sm:text-sm">
              © {new Date().getFullYear()} Raster. Todos os direitos reservados.
            </p>
            <div className="flex gap-4 md:gap-6 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-xs sm:text-sm hover:text-white transition-colors"
              >
                Termos de Uso
              </Link>
              <Link
                href="#"
                className="text-xs sm:text-sm hover:text-white transition-colors"
              >
                Política de Privacidade
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
