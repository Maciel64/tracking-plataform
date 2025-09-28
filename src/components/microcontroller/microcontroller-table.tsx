"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Pencil, Search, Trash2 } from "lucide-react";
import { CheckCircle, XCircle } from "lucide-react";
import { MicrocontrollersDialog } from "@/components/microcontroller/microcontroller-dialog";
import { Badge } from "@/components/ui/badge";
import { Microcontroller } from "@/domain/microcontrollers/microcontroller.model";
import { use, useState, useTransition } from "react";
import { MicrocontrollerRemoveDialog } from "./microcontroller-remove-dialog";
import {
  deleteMicrocontroller,
  updateMicrocontroller,
} from "@/domain/microcontrollers/microcontroller.actions";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Input } from "../ui/input";

interface MicrocontrollerTableProps {
  microcontrollersPromise: Promise<Microcontroller[]>;
}

export function MicrocontrollerTable({
  microcontrollersPromise,
}: MicrocontrollerTableProps) {
  const microcontrollers = use(microcontrollersPromise);
  const { data: session } = useSession();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMicro, setCurrentMicro] = useState<Microcontroller | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, startTransition] = useTransition();

  async function onDelete(id: string) {
    if (!session?.user.id) return toast.error("Usuário não autenticado");

    startTransition(async () => {
      const result = await deleteMicrocontroller(session?.user.id, id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setIsDeleteDialogOpen(false);
      setCurrentMicro(null);
    });
  }

  async function toggleActive(id: string, isActive: boolean) {
    startTransition(async () => {
      const result = await updateMicrocontroller(session?.user.id ?? "", id, {
        active: !isActive,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  }

  return (
    <>
      <div className="flex justify-end items-center gap-4">
        <Search />
        <Input placeholder="awdnaw" className="my-2 max-w-48" />
      </div>

      <div className="border rounded-md">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>MAC Address</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Chip</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {microcontrollers?.map((item, index) => (
              <TableRow key={item.id} className="border-b hover:bg-accent">
                <TableCell className="p-2">{index + 1}</TableCell>
                <TableCell className="p-2">{item.name}</TableCell>
                <TableCell className="p-2">{item.macAddress}</TableCell>
                <TableCell className="p-2">{item.model}</TableCell>
                <TableCell className="p-2">{item.chip}</TableCell>
                <TableCell className="p-2">{item.plate}</TableCell>
                <TableCell className="p-2">{item.vehicleType}</TableCell>
                <TableCell className="p-2">
                  <Badge variant={item.active ? "default" : "secondary"}>
                    {item.active ? "SIM" : "NÃO"}
                  </Badge>
                </TableCell>
                <TableCell className="p-2 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-primary border-primary cursor-pointer"
                        onClick={() => {
                          setCurrentMicro(item);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                  </Dialog>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive(item.id, item.active)}
                    className={
                      item.active
                        ? "text-blue-500 border-blue-500 cursor-pointer"
                        : "text-destructive border-destructive cursor-pointer"
                    }
                  >
                    {item.active ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsDeleteDialogOpen(true);
                      setCurrentMicro(item);
                    }}
                    className="text-destructive border-destructive cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <MicrocontrollerRemoveDialog
        isDialogOpen={isDeleteDialogOpen}
        setIsDialogOpen={setIsDeleteDialogOpen}
        microcontroller={currentMicro}
        isLoading={isDeleting}
        onRemove={onDelete}
      />

      <MicrocontrollersDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        currentMicro={currentMicro}
        setCurrentMicro={setCurrentMicro}
      />
    </>
  );
}
