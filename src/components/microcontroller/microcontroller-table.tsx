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
import { Pencil } from "lucide-react";
import { CheckCircle, XCircle } from "lucide-react";
import { MicrocontrollersDialog } from "@/components/microcontroller/microcontroller-dialog";
import { Badge } from "@/components/ui/badge";
import { Microcontroller } from "@/domain/microcontrollers/microcontroller.model";
import { use, useState } from "react";
import { MicrocontrollerRemoveDialog } from "./microcontroller-remove-dialog";

interface MicrocontrollerTableProps {
  microcontrollersPromise: Promise<Microcontroller[]>;
}

export function MicrocontrollerTable({
  microcontrollersPromise,
}: MicrocontrollerTableProps) {
  const microcontrollers = use(microcontrollersPromise);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMicro, setCurrentMicro] = useState<Microcontroller | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting] = useState(false);

  return (
    <>
      <Table className="w-full text-sm border">
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
                  onClick={() => {}}
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

                <MicrocontrollerRemoveDialog
                  isDialogOpen={isDeleteDialogOpen}
                  setIsDialogOpen={setIsDeleteDialogOpen}
                  microcontroller={currentMicro}
                  isLoading={isDeleting}
                  onRemove={() => {}}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4">
        <MicrocontrollersDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          currentMicro={currentMicro}
          setCurrentMicro={setCurrentMicro}
        />
      </div>
    </>
  );
}
