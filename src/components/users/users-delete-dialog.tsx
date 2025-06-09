import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogContent } from "../ui/dialog";
import { useTransition } from "react";
import { deleteUserAction } from "@/domain/admin/admin.actions";

interface UsersDeleteDialogProps {
  deletingUserId: string | null;
  setDeletingUserId: (id: string | null) => void;
}

export function UsersDeleteDialog({
  deletingUserId,
  setDeletingUserId,
}: UsersDeleteDialogProps) {
  const [isPending, startTransition] = useTransition();

  function handleDeleteUser() {
    startTransition(async () => {
      const result = await deleteUserAction(deletingUserId || "");

      if (result.error) {
        toast.error("Erro ao deletar usuário");
      }

      toast.success("Usuário deletado com sucesso");
      setDeletingUserId(null);
    });
  }

  return (
    <Dialog
      open={!!deletingUserId}
      onOpenChange={(open) => {
        if (!open) setDeletingUserId(null);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-medium leading-none tracking-tight">
            Confirmar Exclusão
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja apagar este usuário? Esta ação não pode ser
            desfeita.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDeletingUserId(null)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteUser}
            disabled={isPending}
          >
            Confirmar Exclusão
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
