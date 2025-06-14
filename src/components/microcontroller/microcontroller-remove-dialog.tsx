import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Microcontroller } from "@/domain/microcontrollers/microcontroller.model";

interface MicrocontrollerRemoveDialogProps {
  isDialogOpen: boolean;
  microcontroller: Microcontroller | null;
  isLoading: boolean;
  setIsDialogOpen: (open: boolean) => void;
  setCurrentMicrocontroller: (microcontroller: Microcontroller | null) => void;
  onRemove: (id: string) => void;
}

export function MicrocontrollerRemoveDialog({
  isDialogOpen,
  setIsDialogOpen,
  onRemove,
  microcontroller,
  setCurrentMicrocontroller,
  isLoading,
}: MicrocontrollerRemoveDialogProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setIsDialogOpen(true);
            setCurrentMicrocontroller(microcontroller);
          }}
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
            Tem certeza que deseja excluir o microcontrolador{" "}
            <span className="text-purple-600 font-semibold">
              {microcontroller?.name}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-2">
            <Button
              className="cursor-pointer"
              variant="outline"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => onRemove(microcontroller?.id || "")}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Excluir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
