import { Cpu, Hash, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Microcontroller } from "@/domain/microcontrollers/microcontroller.model";
import { Badge } from "@/components/ui/badge";
import { getChipColor } from "../microcontroller-card";

interface MicrocontrollerDetailsModalCardProps {
  microcontroller: Microcontroller;
}

export function MicrocontrollerDetailsModalCard({
  microcontroller,
}: MicrocontrollerDetailsModalCardProps) {
  return (
    <Card className="lg:col-span-1 lg:row-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Hash className="h-4 w-4" />
          Dispositivo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">ID:</span>
          <span className="font-mono text-xs">
            {microcontroller?.id?.slice(0, 8)}...
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Modelo:</span>
          <Badge variant="outline" className="text-xs">
            <Cpu className="h-3 w-3 mr-1" />
            {microcontroller?.model}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">MAC:</span>
          <span className="font-mono text-xs">
            {microcontroller?.macAddress}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Chip:</span>
          <Badge
            variant="outline"
            className={`text-xs ${getChipColor(microcontroller?.chip || "")}`}
          >
            <Wifi className="h-3 w-3 mr-1" />
            {microcontroller?.chip}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
