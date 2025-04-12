"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/adapters/firebase.adapter";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AddMicrocontroller from "@/components/microcontroller/add-microcontroller";
import {
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Filter,
  Plus,
} from "lucide-react";

export default function Page() {
  const [microcontrollers, setMicrocontrollers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
    <div className="p-4 text-white bg-black min-h-screen">
      <h1 className="text-4xl font-bold mb-1">
        Micro<span className="text-purple-500">controladores</span>
      </h1>
      <p className="text-sm mb-4 text-muted-foreground">
        Gerencie todos os microcontroladores
      </p>

      <div className="mb-4">
        <AddMicrocontroller onAdd={fetchData} />
      </div>

      <div className="border p-4 rounded-lg mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filtros e pesquisa</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Buscar por nome, email ou cargo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline">Todos os Status</Button>
          <Button variant="outline">Todos os Departamentos</Button>
          <Button variant="outline"></Button>
        </div>
      </div>

      <div className="border p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Plus className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Lista de microcontroladores</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          {microcontrollers.length} microcontroladores
        </p>

        <div className="overflow-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-zinc-900 border-b">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Nome</th>
                <th className="p-2 text-left">MAC Adress</th>
                <th className="p-2 text-left">Modelo</th>
                <th className="p-2 text-left">Chip</th>
                <th className="p-2 text-left">Ativo</th>
                <th className="p-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-zinc-800">
                  <td className="p-2">{item.index}</td>
                  <td className="p-2">{item.nome}</td>
                  <td className="p-2">{item.mac_address}</td>
                  <td className="p-2">{item.modelo}</td>
                  <td className="p-2">{item.chip}</td>
                  <td className="p-2">{item.ativo ? "SIM" : "NÃO"}</td>
                  <td className="p-2 flex gap-2">
                    {/* Botão editar (você pode conectar ao modal que já tem) */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-500 border-green-500"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {/* Botão desativar */}
                    <Button
                      size="sm"
                      variant="outline"
                      className={
                        item.ativo
                          ? "text-blue-500 border-blue-500"
                          : "text-red-500 border-red-500"
                      }
                      onClick={() => toggleActive(item.id, item.ativo)}
                    >
                      {item.ativo ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </Button>
                    {/* Botão excluir */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 border-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <div className="space-y-4">
                          <h3 className="text-lg font-bold">
                            Confirmar exclusão
                          </h3>
                          <p>
                            Tem certeza que deseja excluir este
                            microcontrolador?
                          </p>
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost">Cancelar</Button>
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
