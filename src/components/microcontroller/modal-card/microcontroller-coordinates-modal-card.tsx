import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Microcontroller } from "@/domain/microcontrollers/microcontroller.model";
import { MapPin } from "lucide-react";
import { formatDate } from "@/utils/format";

interface MicrocontrollerCoordinatesModalCardProps {
  microcontroller: Microcontroller;
}

export function MicrocontrollerCoordinatesModalCard({
  microcontroller,
}: MicrocontrollerCoordinatesModalCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Localização Atual
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Latitude:</span>
          <span className="font-mono text-xs">
            {microcontroller?.coordinates?.[0]?.latitude || "-"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Longitude:</span>
          <span className="font-mono text-xs">
            {microcontroller?.coordinates?.[0]?.longitude || "-"}
          </span>
        </div>
        {microcontroller?.coordinates?.[0]?.createdAt && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Atualizado:</span>
            <span className="text-xs">
              {formatDate(
                microcontroller?.coordinates?.[0]?.createdAt || new Date()
              )}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
