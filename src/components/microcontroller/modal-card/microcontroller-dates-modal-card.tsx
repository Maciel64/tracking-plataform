import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Microcontroller } from "@/domain/microcontrollers/microcontroller.model";
import { Calendar } from "lucide-react";
import { formatDate } from "@/utils/format";

interface MicrocontrollerDatesModalCardProps {
  microcontroller: Microcontroller;
}

export function MicrocontrollerDatesModalCard({
  microcontroller,
}: MicrocontrollerDatesModalCardProps) {
  return (
    <Card className="lg:col-span-1 lg:row-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Registro
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Criado:</span>
          <span className="text-xs">
            {formatDate(microcontroller?.createdAt)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Atualizado:</span>
          <span className="text-xs">
            {formatDate(microcontroller?.updatedAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
