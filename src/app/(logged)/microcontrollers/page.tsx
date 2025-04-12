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

const generateRandomName = () => {
  return Math.random().toString(36).substring(2, 10);
};

export default function MicrocontrollersPage() {
  // Estados para listagem e edição
  const [microcontrollers, setMicrocontrollers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<any>({
    nome: "",
    mac_address: "",
    modelo: "",
    chip: "",
    placa: "",
    tipo: "",
  });
  const [errors, setErrors] = useState<any>({});

  // Estados para adição
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addData, setAddData] = useState({
    nome: generateRandomName(),
    mac_address: "",
    modelo: "",
    chip: "",
    placa: "",
    tipo: "",
  });
  const [addErrors, setAddErrors] = useState<any>({});

  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, "microcontrollers"));
    const data = snapshot.docs.map((doc, index) => ({
      id: doc.id,
      index: index + 1,
      ...doc.data(),
    }));
    setMicrocontrollers(data);
    setLoading(false);
  };

  // Funções para adição
  const isValidMac = (mac: string) => {
    const regex = /^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/;
    return regex.test(mac);
  };

  const isValidPlate = (plate: string) => {
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

  const validateAddFields = () => {
    const newErrors: any = {};

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

  const handleAdd = async () => {
    if (!validateAddFields()) return;

    const microRef = collection(db, "microcontrollers");

    const [macSnapshot, placaSnapshot] = await Promise.all([
      getDocs(query(microRef, where("mac_address", "==", addData.mac_address))),
      getDocs(
        query(microRef, where("placa", "==", addData.placa.toUpperCase()))
      ),
    ]);

    const newErrors: any = {};

    if (!macSnapshot.empty) {
      newErrors.mac_address = "Já existe um microcontrolador com esse MAC.";
    }

    if (!placaSnapshot.empty) {
      newErrors.placa = "Já existe um microcontrolador com essa placa.";
    }

    if (Object.keys(newErrors).length > 0) {
      setAddErrors((prev: any) => ({ ...prev, ...newErrors }));
      return;
    }

    await addDoc(microRef, {
      nome: addData.nome,
      mac_address: addData.mac_address,
      modelo: addData.modelo,
      chip: addData.chip,
      placa: addData.placa.toUpperCase(),
      tipo: addData.tipo,
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

  const validateEdit = () => {
    const newErrors: any = {};

    if (!editData.nome) newErrors.nome = "Nome é obrigatório.";
    if (!editData.mac_address.match(/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/i))
      newErrors.mac_address = "MAC inválido. Ex: 00:11:22:33:44:55";
    if (!editData.modelo) newErrors.modelo = "Modelo é obrigatório.";
    if (!editData.chip) newErrors.chip = "Chip é obrigatório.";
    if (!editData.tipo) newErrors.tipo = "Tipo de veículo é obrigatório.";
    if (!editData.placa.match(/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/))
      newErrors.placa = "Placa inválida. Ex: ABC1A23";

    const existsMac = microcontrollers.find(
      (mc) => mc.mac_address === editData.mac_address && mc.id !== editData.id
    );
    const existsPlaca = microcontrollers.find(
      (mc) => mc.placa === editData.placa && mc.id !== editData.id
    );
    if (existsMac) newErrors.mac_address = "MAC já cadastrado.";
    if (existsPlaca) newErrors.placa = "Placa já cadastrada.";

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
    <div className="p-4 text-white bg-black min-h-screen ">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Microcontroladores
        </span>
      </h1>
      <p className="mt-2 text-muted-foreground pb-4">
        Gerencie todos os microcontroladores
      </p>

      <div className="mb-4">
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Microcontrolador
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <div className="space-y-4">
              <DialogTitle className="text-lg pb-2">
                Adicionar Microcontrolador
              </DialogTitle>

              <div>
                <Label className="pb-1">Nome</Label>
                <Input
                  value={addData.nome}
                  onChange={(e) =>
                    setAddData({ ...addData, nome: e.target.value })
                  }
                  placeholder="Digite o nome"
                />
                {addErrors.nome && (
                  <p className="text-red-500 text-xs">{addErrors.nome}</p>
                )}
              </div>

              <div>
                <Label className="pb-1">MAC Address</Label>
                <Input
                  value={addData.mac_address}
                  onChange={(e) =>
                    setAddData({ ...addData, mac_address: e.target.value })
                  }
                  placeholder="00:11:22:33:44:55"
                />
                {addErrors.mac_address && (
                  <p className="text-red-500 text-xs">
                    {addErrors.mac_address}
                  </p>
                )}
              </div>

              <div>
                <Label className="pb-1">Modelo</Label>
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
                  <p className="text-red-500 text-xs">{addErrors.modelo}</p>
                )}
              </div>

              <div>
                <Label className="pb-1">Chip</Label>
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
                  <p className="text-red-500 text-xs">{addErrors.chip}</p>
                )}
              </div>

              <div>
                <Label className="pb-1">Placa</Label>
                <Input
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
                  <p className="text-red-500 text-xs">{addErrors.placa}</p>
                )}
              </div>

              <div>
                <Label className="pb-1">Tipo de veículo</Label>
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
                  <p className="text-red-500 text-xs">{addErrors.tipo}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  className="cursor-pointer"
                  variant="ghost"
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

      <div className="border p-4 rounded-lg mb-4">
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

      <div className="border p-4 rounded-lg">
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
              <tr className="bg-zinc-900 border-b">
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
                <tr key={item.id} className="border-b hover:bg-zinc-800">
                  <td className="p-2">{item.index}</td>
                  <td className="p-2">{item.nome}</td>
                  <td className="p-2">{item.mac_address}</td>
                  <td className="p-2">{item.modelo}</td>
                  <td className="p-2">{item.chip}</td>
                  <td className="p-2">{item.placa}</td>
                  <td className="p-2">{item.tipo}</td>
                  <td className="p-2">{item.ativo ? "SIM" : "NÃO"}</td>
                  <td className="p-2 flex gap-2">
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-500 border-green-500 cursor-pointer"
                          onClick={() => setEditData(item)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <div className="space-y-2">
                          <DialogTitle className="text-lg pb-2">
                            Editar Microcontrolador
                          </DialogTitle>
                          <div>
                            <Label className="pb-1">Nome</Label>
                            <Input
                              value={editData.nome}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  nome: e.target.value,
                                })
                              }
                              placeholder="Digite o nome"
                            />
                            {errors.nome && (
                              <p className="text-red-500 text-xs">
                                {errors.nome}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label className="pb-1">MAC Address</Label>
                            <Input
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
                              <p className="text-red-500 text-xs">
                                {errors.mac_address}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label className="pb-1">Modelo</Label>
                            <Select
                              value={editData.modelo}
                              onValueChange={(value) =>
                                setEditData({ ...editData, modelo: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o modelo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Raster1">
                                  Raster 1
                                </SelectItem>
                                <SelectItem value="Raster2">
                                  Raster 2
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.modelo && (
                              <p className="text-red-500 text-xs">
                                {errors.modelo}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label className="pb-1">Chip</Label>
                            <Select
                              value={editData.chip}
                              onValueChange={(value) =>
                                setEditData({ ...editData, chip: value })
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
                            {errors.chip && (
                              <p className="text-red-500 text-xs">
                                {errors.chip}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label className="pb-1">Placa</Label>
                            <Input
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
                              <p className="text-red-500 text-xs">
                                {errors.placa}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label className="pb-1">Tipo de veículo</Label>
                            <Select
                              value={editData.tipo}
                              onValueChange={(value) =>
                                setEditData({ ...editData, tipo: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Tipo de veículo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="carro">Carro</SelectItem>
                                <SelectItem value="moto">Moto</SelectItem>
                                <SelectItem value="caminhão">
                                  Caminhão
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.tipo && (
                              <p className="text-red-500 text-xs">
                                {errors.tipo}
                              </p>
                            )}
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <Button
                              variant="ghost"
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
                    </Dialog>
                    <Button
                      size="sm"
                      variant="outline"
                      className={
                        item.ativo
                          ? "text-blue-500 border-blue-500 cursor-pointer"
                          : "text-red-500 border-red-500 cursor-pointer"
                      }
                      onClick={() => toggleActive(item.id, item.ativo)}
                    >
                      {item.ativo ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 border-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <div className="space-y-4">
                          <DialogTitle className="text-lg">
                            Confirmar exclusão
                          </DialogTitle>
                          <p>
                            Tem certeza que deseja excluir este
                            microcontrolador?
                          </p>
                          <div className="flex justify-end gap-2">
                            <Button className="cursor-pointer" variant="ghost">
                              Cancelar
                            </Button>
                            <Button
                              className="cursor-pointer"
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
