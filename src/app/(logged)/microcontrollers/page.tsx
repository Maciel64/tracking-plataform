"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/adapters/firebase.adapter";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
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
  CheckCircle,
  XCircle,
  Filter,
  PlusCircle,
  Cpu,
} from "lucide-react";
import { useTheme } from "next-themes"; // Para pegar o tema global
import { DialogPortal } from "@radix-ui/react-dialog";

const generateRandomName = () => {
  return Math.random().toString(36).substring(2, 10);
};

interface Microcontroller {
  id: string;
  index?: number;
  nome: string;
  mac_address: string;
  modelo: string;
  chip: string;
  placa: string;
  tipo: string;
  ativo?: boolean;
}

interface FormErrors {
  nome?: string;
  mac_address?: string;
  modelo?: string;
  chip?: string;
  placa?: string;
  tipo?: string;
}

export default function MicrocontrollersPage() {
  const { theme } = useTheme();

  // Estados tipados
  const [microcontrollers, setMicrocontrollers] = useState<Microcontroller[]>(
    []
  );
  const [search, setSearch] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<Microcontroller>({
    id: "",
    nome: "",
    mac_address: "",
    modelo: "",
    chip: "",
    placa: "",
    tipo: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Estados para adição
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addData, setAddData] = useState<
    Omit<Microcontroller, "id" | "index" | "ativo">
  >({
    nome: generateRandomName(),
    mac_address: "",
    modelo: "",
    chip: "",
    placa: "",
    tipo: "",
  });
  const [addErrors, setAddErrors] = useState<FormErrors>({});

  // Função fetchData permanece igual, mas agora retorna Microcontroller[]
  const fetchData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "microcontrollers"));
      const data = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        index: index + 1,
        ...doc.data(),
      })) as Microcontroller[];
      setMicrocontrollers(data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
    }
  };

  // Funções para adição
  const isValidMac = (mac: string): boolean => {
    const regex = /^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/;
    return regex.test(mac);
  };

  const isValidPlate = (plate: string): boolean => {
    const regex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
    return regex.test(plate);
  };

  const resetAddForm = () => {
    setAddData({
      nome: generateRandomName(),
      mac_address: "",
      modelo: "",
      chip: "",
      placa: "",
      tipo: "",
    });
    setAddErrors({});
  };

  const validateAddFields = (): boolean => {
    const newErrors: FormErrors = {};

    if (!addData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    else if (addData.nome.length > 10)
      newErrors.nome = "Máximo de 10 caracteres";

    if (!addData.mac_address.trim())
      newErrors.mac_address = "MAC é obrigatório";
    else if (!isValidMac(addData.mac_address.trim()))
      newErrors.mac_address = "MAC inválido. Ex: 00:11:22:33:44:55";

    if (!addData.modelo.trim()) newErrors.modelo = "Modelo é obrigatório";

    if (!addData.chip.trim()) newErrors.chip = "Chip é obrigatório";

    if (!addData.placa.trim()) newErrors.placa = "Placa é obrigatória";
    else if (!isValidPlate(addData.placa.trim()))
      newErrors.placa = "Placa inválida. Ex: ABC1A23";

    if (!addData.tipo.trim()) newErrors.tipo = "Tipo é obrigatório";

    setAddErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async (): Promise<void> => {
    if (!validateAddFields()) return;

    const microRef = collection(db, "microcontrollers");

    const [macSnapshot, placaSnapshot] = await Promise.all([
      getDocs(query(microRef, where("mac_address", "==", addData.mac_address))),
      getDocs(
        query(microRef, where("placa", "==", addData.placa.toUpperCase()))
      ),
    ]);

    const newErrors: FormErrors = {};

    if (!macSnapshot.empty) {
      newErrors.mac_address = "Já existe um microcontrolador com esse MAC.";
    }

    if (!placaSnapshot.empty) {
      newErrors.placa = "Já existe um microcontrolador com essa placa.";
    }

    if (Object.keys(newErrors).length > 0) {
      setAddErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    await addDoc(microRef, {
      ...addData,
      placa: addData.placa.toUpperCase(),
      ativo: true,
    });

    setIsAddOpen(false);
    resetAddForm();
    fetchData();
  };

  // Funções para edição/exclusão
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "microcontrollers", id));
    fetchData();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await updateDoc(doc(db, "microcontrollers", id), {
      ativo: !current,
    });
    fetchData();
  };

  const validateEdit = (): boolean => {
    const newErrors: FormErrors = {}; // Usando sua interface existente

    // Validações dos campos
    if (!editData.nome?.trim()) newErrors.nome = "Nome é obrigatório";
    if (!editData.mac_address?.trim()) {
      newErrors.mac_address = "MAC é obrigatório";
    } else if (
      !/^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/.test(editData.mac_address)
    ) {
      newErrors.mac_address = "Formato inválido (use 00:11:22:33:44:55)";
    }

    if (!editData.modelo?.trim()) newErrors.modelo = "Modelo é obrigatório";
    if (!editData.chip?.trim()) newErrors.chip = "Chip é obrigatório";
    if (!editData.tipo?.trim()) newErrors.tipo = "Tipo é obrigatório";

    // Validação específica para placa
    if (!editData.placa?.trim()) {
      newErrors.placa = "Placa é obrigatória";
    } else if (!/^[A-Z]{3}\d[A-Z]\d{2}$/.test(editData.placa.toUpperCase())) {
      newErrors.placa = "Formato inválido (ex: ABC1D23)";
    }

    // Verificação de duplicados
    const isDuplicateMac = microcontrollers.some(
      (mc) => mc.id !== editData.id && mc.mac_address === editData.mac_address
    );
    const isDuplicatePlaca = microcontrollers.some(
      (mc) => mc.id !== editData.id && mc.placa === editData.placa.toUpperCase()
    );

    if (isDuplicateMac) newErrors.mac_address = "MAC já cadastrado";
    if (isDuplicatePlaca) newErrors.placa = "Placa já cadastrada";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSubmit = async () => {
    if (!validateEdit()) return;
    await updateDoc(doc(db, "microcontrollers", editData.id), {
      ...editData,
    });
    setIsEditOpen(false);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = microcontrollers.filter((item) => {
    return (
      item.nome?.toLowerCase().includes(search.toLowerCase()) ||
      item.mac_address?.toLowerCase().includes(search.toLowerCase()) ||
      item.modelo?.toLowerCase().includes(search.toLowerCase()) ||
      item.placa?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-4 min-h-screen bg-background text-foreground">
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
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
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
                className={`${theme === "dark" ? "text-white" : "text-black"}`}
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
                  id="nome"
                  value={addData.nome}
                  onChange={(e) =>
                    setAddData({ ...addData, nome: e.target.value })
                  }
                  className="bg-card"
                />
                {addErrors.nome && (
                  <p className="text-sm text-destructive">{addErrors.nome}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mac">MAC Address</Label>
                <Input
                  id="mac"
                  value={addData.mac_address}
                  onChange={(e) =>
                    setAddData({ ...addData, mac_address: e.target.value })
                  }
                  placeholder="00:11:22:33:44:55"
                />
                {addErrors.mac_address && (
                  <p className="text-sm text-destructive">
                    {addErrors.mac_address}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Modelo</Label>
                <Select
                  value={addData.modelo}
                  onValueChange={(value) =>
                    setAddData({ ...addData, modelo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Raster1">Raster 1</SelectItem>
                    <SelectItem value="Raster2">Raster 2</SelectItem>
                  </SelectContent>
                </Select>
                {addErrors.modelo && (
                  <p className="text-sm text-destructive">{addErrors.modelo}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Chip</Label>
                <Select
                  value={addData.chip}
                  onValueChange={(value) =>
                    setAddData({ ...addData, chip: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o chip" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIVO">VIVO</SelectItem>
                    <SelectItem value="CLARO">CLARO</SelectItem>
                    <SelectItem value="TIM">TIM</SelectItem>
                  </SelectContent>
                </Select>
                {addErrors.chip && (
                  <p className="text-sm text-destructive">{addErrors.chip}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="placa">Placa</Label>
                <Input
                  id="placa"
                  value={addData.placa}
                  onChange={(e) =>
                    setAddData({
                      ...addData,
                      placa: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="ABC1A23"
                />
                {addErrors.placa && (
                  <p className="text-sm text-destructive">{addErrors.placa}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Tipo de veículo</Label>
                <Select
                  value={addData.tipo}
                  onValueChange={(value) =>
                    setAddData({ ...addData, tipo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carro">Carro</SelectItem>
                    <SelectItem value="moto">Moto</SelectItem>
                    <SelectItem value="caminhão">Caminhão</SelectItem>
                  </SelectContent>
                </Select>
                {addErrors.tipo && (
                  <p className="text-sm text-destructive">{addErrors.tipo}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() => setIsAddOpen(false)}
                >
                  Cancelar
                </Button>
                <Button className="cursor-pointer" onClick={handleAdd}>
                  Cadastrar
                </Button>
              </div>
            </div>
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
          {microcontrollers.length} microcontroladores cadastrados
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
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-accent">
                  <td className="p-2">{item.index}</td>
                  <td className="p-2">{item.nome}</td>
                  <td className="p-2">{item.mac_address}</td>
                  <td className="p-2">{item.modelo}</td>
                  <td className="p-2">{item.chip}</td>
                  <td className="p-2">{item.placa}</td>
                  <td className="p-2">{item.tipo}</td>
                  <td className="p-2">{item.ativo ? "SIM" : "NÃO"}</td>
                  <td className="p-2 flex gap-2">
                    {/*===============EDITAR=============== {cn("sm:max-w-[425px]",theme === "light" ? "bg-white" : "bg-black")}*/}

                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-primary border-primary cursor-pointer"
                          onClick={() => setEditData(item)}
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
                                value={editData.nome}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    nome: e.target.value,
                                  })
                                }
                              />
                              {errors.nome && (
                                <p className="text-sm text-destructive">
                                  {errors.nome}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-mac">MAC Address</Label>
                              <Input
                                id="edit-mac"
                                className="bg-white dark:bg-zinc-800 dark:text-white"
                                value={editData.mac_address}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    mac_address: e.target.value,
                                  })
                                }
                                placeholder="00:11:22:33:44:55"
                              />
                              {errors.mac_address && (
                                <p className="text-sm text-destructive">
                                  {errors.mac_address}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label>Modelo</Label>
                              <Select
                                value={editData.modelo}
                                onValueChange={(value) =>
                                  setEditData({ ...editData, modelo: value })
                                }
                              >
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
                              {errors.modelo && (
                                <p className="text-sm text-destructive">
                                  {errors.modelo}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label>Chip</Label>
                              <Select
                                value={editData.chip}
                                onValueChange={(value) =>
                                  setEditData({ ...editData, chip: value })
                                }
                              >
                                <SelectTrigger className="dark:bg-zinc-800 dark:text-white">
                                  <SelectValue placeholder="Selecione o chip" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-zinc-800 dark:text-white">
                                  <SelectItem value="VIVO">VIVO</SelectItem>
                                  <SelectItem value="CLARO">CLARO</SelectItem>
                                  <SelectItem value="TIM">TIM</SelectItem>
                                </SelectContent>
                              </Select>
                              {errors.chip && (
                                <p className="text-sm text-destructive">
                                  {errors.chip}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-placa">Placa</Label>
                              <Input
                                id="edit-placa"
                                className="bg-white dark:bg-zinc-800 dark:text-white"
                                value={editData.placa}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    placa: e.target.value.toUpperCase(),
                                  })
                                }
                                placeholder="ABC1A23"
                              />
                              {errors.placa && (
                                <p className="text-sm text-destructive">
                                  {errors.placa}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label>Tipo de veículo</Label>
                              <Select
                                value={editData.tipo}
                                onValueChange={(value) =>
                                  setEditData({ ...editData, tipo: value })
                                }
                              >
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
                              {errors.tipo && (
                                <p className="text-sm text-destructive">
                                  {errors.tipo}
                                </p>
                              )}
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                              <Button
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                                className="cursor-pointer"
                              >
                                Cancelar
                              </Button>
                              <Button
                                className="cursor-pointer"
                                onClick={handleEditSubmit}
                              >
                                Salvar
                              </Button>
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
                      onClick={() => toggleActive(item.id, item.ativo ?? false)}
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
                              variant="destructive"
                              onClick={() => handleDelete(item.id)}
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
