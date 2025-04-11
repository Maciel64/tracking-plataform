"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/adapters/firebase.adapter";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Check, Pencil, Trash2, X } from "lucide-react";
import AddMicrocontroller from "@/components/microcontroller/add-microcontroller";

interface Microcontroller {
  id: string;
  nome: string;
  mac_address: string;
  modelo: string;
  chip: string;
  placa: string;
  tipo: string;
  ativo: boolean;
}

export default function Page() {
  const [microcontroladores, setMicrocontroladores] = useState<
    Microcontroller[]
  >([]);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState<Microcontroller | null>(null);
  const [confirmarExclusao, setConfirmarExclusao] = useState<string | null>(
    null
  );

  const getMicrocontroladores = async () => {
    const querySnapshot = await getDocs(collection(db, "microcontrollers"));
    const lista: Microcontroller[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      lista.push({
        id: docSnap.id,
        nome: data.nome,
        mac_address: data.mac_address,
        modelo: data.modelo,
        chip: data.chip,
        placa: data.placa,
        tipo: data.tipo,
        ativo: data.ativo,
      });
    });

    setMicrocontroladores(lista);
  };

  const handleDesativar = async (id: string, ativoAtual: boolean) => {
    await updateDoc(doc(db, "microcontrollers", id), {
      ativo: !ativoAtual,
    });
    getMicrocontroladores();
  };

  const handleExcluir = async (id: string) => {
    await deleteDoc(doc(db, "microcontrollers", id));
    setConfirmarExclusao(null);
    getMicrocontroladores();
  };

  const handleEditar = async () => {
    if (!editando) return;
    await updateDoc(doc(db, "microcontrollers", editando.id), {
      nome: editando.nome,
      mac_address: editando.mac_address,
      modelo: editando.modelo,
      chip: editando.chip,
      placa: editando.placa,
      tipo: editando.tipo,
    });
    setEditando(null);
    getMicrocontroladores();
  };

  const microFiltrados = microcontroladores.filter((micro) =>
    micro.placa.toLowerCase().includes(busca.toLowerCase())
  );

  useEffect(() => {
    getMicrocontroladores();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Buscar pela placa..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="max-w-xs"
        />
        <AddMicrocontroller onAdd={getMicrocontroladores} />
      </div>

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Nome</th>
            <th className="p-2">Placa</th>
            <th className="p-2">MAC</th>
            <th className="p-2">Modelo</th>
            <th className="p-2">Chip</th>
            <th className="p-2">Tipo</th>
            <th className="p-2">Ativo</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {microFiltrados.map((micro) => (
            <tr key={micro.id} className="border-t">
              <td className="p-2">{micro.nome}</td>
              <td className="p-2">{micro.placa}</td>
              <td className="p-2">{micro.mac_address}</td>
              <td className="p-2">{micro.modelo}</td>
              <td className="p-2">{micro.chip}</td>
              <td className="p-2">{micro.tipo}</td>
              <td className="p-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDesativar(micro.id, micro.ativo)}
                  className={micro.ativo ? "text-blue-600" : "text-red-600"}
                >
                  {micro.ativo ? <Check /> : <X />}
                </Button>
              </td>
              <td className="p-2 flex gap-2">
                <Dialog
                  open={editando?.id === micro.id}
                  onOpenChange={(open) => !open && setEditando(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      className="text-green-600"
                      onClick={() => setEditando(micro)}
                    >
                      <Pencil />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <div className="space-y-2">
                      <Input
                        placeholder="Nome"
                        value={editando?.nome || ""}
                        onChange={(e) =>
                          setEditando({ ...editando!, nome: e.target.value })
                        }
                      />
                      <Input
                        placeholder="MAC"
                        value={editando?.mac_address || ""}
                        onChange={(e) =>
                          setEditando({
                            ...editando!,
                            mac_address: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Modelo"
                        value={editando?.modelo || ""}
                        onChange={(e) =>
                          setEditando({ ...editando!, modelo: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Chip"
                        value={editando?.chip || ""}
                        onChange={(e) =>
                          setEditando({ ...editando!, chip: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Placa"
                        value={editando?.placa || ""}
                        onChange={(e) =>
                          setEditando({ ...editando!, placa: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Tipo"
                        value={editando?.tipo || ""}
                        onChange={(e) =>
                          setEditando({ ...editando!, tipo: e.target.value })
                        }
                      />
                      <div className="flex justify-end">
                        <Button onClick={handleEditar}>Salvar</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={confirmarExclusao === micro.id}
                  onOpenChange={(open) => !open && setConfirmarExclusao(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      className="text-red-600"
                      onClick={() => setConfirmarExclusao(micro.id)}
                    >
                      <Trash2 />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="text-center">
                    <p className="mb-4">Tem certeza que deseja excluir?</p>
                    <div className="flex justify-center gap-4">
                      <Button onClick={() => handleExcluir(micro.id)}>
                        Confirmar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setConfirmarExclusao(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
