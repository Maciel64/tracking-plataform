import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Microcontroller } from "@/domain/microcontrollers/microcontroller.model";
import { Badge } from "@/components/ui/badge";
import { getVehicleIcon } from "../microcontroller-card";
import { getVehicleTypeName } from "../microcontroller-modal";
import { Car, Tag } from "lucide-react";

interface MicrocontrollerVeichleModalCardProps {
  microcontroller: Microcontroller;
}

export function MicrocontrollerVeichleModalCard({
  microcontroller,
}: MicrocontrollerVeichleModalCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Car className="h-4 w-4" />
          Veículo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Placa:</span>
          <Badge variant="outline" className="text-xs">
            <Tag className="h-3 w-3 mr-1" />
            {microcontroller?.plate}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tipo:</span>
          <Badge variant="outline" className="text-xs">
            {getVehicleIcon(microcontroller?.vehicleType || "")}
            {getVehicleTypeName(microcontroller?.vehicleType || "")}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Usuário:</span>
          <span className="font-mono text-xs">
            {microcontroller?.userId?.slice(0, 8)}...
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
