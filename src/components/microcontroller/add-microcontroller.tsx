"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/adapters/firebase.adapter";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";

interface AddMicrocontrollerProps {
  onAdd: () => void;
}

const generateRandomName = () => {
  return Math.random().toString(36).substring(2, 10);
};

const isValidMac = (mac: string) => {
  const regex = /^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/;
  return regex.test(mac);
};

const isValidPlate = (plate: string) => {
  const regex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
  return regex.test(plate);
};

export default function AddMicrocontroller({ onAdd }: AddMicrocontrollerProps) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState(generateRandomName());
  const [mac, setMac] = useState("");
  const [modelo, setModelo] = useState("");
  const [chip, setChip] = useState("");
  const [placa, setPlaca] = useState("");
  const [tipo, setTipo] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const resetForm = () => {
    setNome(generateRandomName());
    setMac("");
    setModelo("");
    setChip("");
    setPlaca("");
    setTipo("");
    setErrors({});
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    if (!nome.trim()) newErrors.nome = "Nome é obrigatório";
    else if (nome.length > 10) newErrors.nome = "Máximo de 10 caracteres";

    if (!mac.trim()) newErrors.mac_address = "MAC é obrigatório";
    else if (!isValidMac(mac.trim()))
      newErrors.mac_address = "MAC inválido. Ex: 00:11:22:33:44:55";

    if (!modelo.trim()) newErrors.modelo = "Modelo é obrigatório";

    if (!chip.trim()) newErrors.chip = "Chip é obrigatório";

    if (!placa.trim()) newErrors.placa = "Placa é obrigatória";
    else if (!isValidPlate(placa.trim()))
      newErrors.placa = "Placa inválida. Ex: ABC1A23";

    if (!tipo.trim()) newErrors.tipo = "Tipo é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateFields()) return;

    const microRef = collection(db, "microcontrollers");

    const [macSnapshot, placaSnapshot] = await Promise.all([
      getDocs(query(microRef, where("mac_address", "==", mac))),
      getDocs(query(microRef, where("placa", "==", placa.toUpperCase()))),
    ]);

    const newErrors: { [key: string]: string } = {};

    if (!macSnapshot.empty) {
      newErrors.mac_address = "Já existe um microcontrolador com esse MAC.";
    }

    if (!placaSnapshot.empty) {
      newErrors.placa = "Já existe um microcontrolador com essa placa.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    await addDoc(microRef, {
      nome,
      mac_address: mac,
      modelo,
      chip,
      placa: placa.toUpperCase(),
      tipo,
      ativo: true,
    });

    setOpen(false);
    resetForm();
    onAdd();
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <PlusCircle className="mr-2 h-4 w-4 " />
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
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome"
            />
            {errors.nome && (
              <p className="text-red-500 text-xs">{errors.nome}</p>
            )}
          </div>

          <div>
            <Label className="pb-1">MAC Address</Label>
            <Input
              value={mac}
              onChange={(e) => setMac(e.target.value)}
              placeholder="00:11:22:33:44:55"
            />
            {errors.mac_address && (
              <p className="text-red-500 text-xs">{errors.mac_address}</p>
            )}
          </div>

          <div>
            <Label className="pb-1">Modelo</Label>
            <Select value={modelo} onValueChange={(value) => setModelo(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Raster1">Raster 1</SelectItem>
                <SelectItem value="Raster2">Raster 2</SelectItem>
              </SelectContent>
            </Select>
            {errors.modelo && (
              <p className="text-red-500 text-xs">{errors.modelo}</p>
            )}
          </div>

          <div>
            <Label className="pb-1">Chip</Label>
            <Select value={chip} onValueChange={(value) => setChip(value)}>
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
              <p className="text-red-500 text-xs">{errors.chip}</p>
            )}
          </div>

          <div>
            <Label className="pb-1">Placa</Label>
            <Input
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              placeholder="ABC1A23"
            />
            {errors.placa && (
              <p className="text-red-500 text-xs">{errors.placa}</p>
            )}
          </div>

          <div>
            <Label className="pb-1">Tipo de veículo</Label>
            <Select value={tipo} onValueChange={(value) => setTipo(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de veículo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carro">Carro</SelectItem>
                <SelectItem value="moto">Moto</SelectItem>
                <SelectItem value="caminhão">Caminhão</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo && (
              <p className="text-red-500 text-xs">{errors.tipo}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              className="cursor-pointer"
              variant="ghost"
              onClick={() => setOpen(false)}
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
  );
}
