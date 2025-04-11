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

interface AddMicrocontrollerProps {
  onAdd: () => void;
}

const generateRandomName = () => {
  return Math.random().toString(36).substring(2, 10);
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
    if (nome.length > 10) newErrors.nome = "Máximo de 10 caracteres";

    if (!mac.trim()) newErrors.mac = "MAC é obrigatório";
    if (!modelo.trim()) newErrors.modelo = "Modelo é obrigatório";
    if (!chip.trim()) newErrors.chip = "Chip é obrigatório";
    if (!placa.trim()) newErrors.placa = "Placa é obrigatória";
    if (!tipo.trim()) newErrors.tipo = "Tipo é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateFields()) return;

    const microRef = collection(db, "microcontrollers");

    const snapshot = await getDocs(
      query(
        microRef,
        where("mac_address", "==", mac),
        where("placa", "==", placa)
      )
    );

    if (!snapshot.empty) {
      setErrors({
        ...errors,
        placa: "Já existe um microcontrolador com essa placa e MAC.",
      });
      return;
    }

    await addDoc(microRef, {
      nome,
      mac_address: mac,
      modelo,
      chip,
      placa,
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
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <div className="space-y-4">
          <div>
            <Label>Nome do microcontrolador</Label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
            {errors.nome && (
              <p className="text-sm text-red-500">{errors.nome}</p>
            )}
          </div>

          <div>
            <Label>Endereço MAC</Label>
            <Input value={mac} onChange={(e) => setMac(e.target.value)} />
            {errors.mac && <p className="text-sm text-red-500">{errors.mac}</p>}
          </div>

          <div>
            <Label>Modelo do dispositivo</Label>
            <Input value={modelo} onChange={(e) => setModelo(e.target.value)} />
            {errors.modelo && (
              <p className="text-sm text-red-500">{errors.modelo}</p>
            )}
          </div>

          <div>
            <Label>Operadora do chip</Label>
            <Input value={chip} onChange={(e) => setChip(e.target.value)} />
            {errors.chip && (
              <p className="text-sm text-red-500">{errors.chip}</p>
            )}
          </div>

          <div>
            <Label>Placa do veículo</Label>
            <Input value={placa} onChange={(e) => setPlaca(e.target.value)} />
            {errors.placa && (
              <p className="text-sm text-red-500">{errors.placa}</p>
            )}
          </div>

          <div>
            <Label>Tipo de veículo</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="moto">Moto</SelectItem>
                <SelectItem value="carro">Carro</SelectItem>
                <SelectItem value="caminhão">Caminhão</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo && (
              <p className="text-sm text-red-500">{errors.tipo}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleAdd}>Cadastrar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
