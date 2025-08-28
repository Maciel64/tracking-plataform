"use client";

import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import type { Coordinate } from "@/domain/coordinates/coordinate.model";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CoordinateHistoryProps {
  coordinates?: Coordinate[];
  onCoordinateSelect: (coordinate: Coordinate) => void;
  selectedCoordinate: Coordinate | null;
}

export function MicrocontrollerCoordinateHistory({
  coordinates,
  onCoordinateSelect,
  selectedCoordinate,
}: CoordinateHistoryProps) {
  const isSelected = (coordinate: Coordinate) => {
    return selectedCoordinate && selectedCoordinate.id === coordinate.id;
  };

  if (coordinates?.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mx-auto mb-2" />
        <p>Nenhuma coordenada encontrada</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico deste Chip</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {coordinates?.map((coordinate, index) => (
            <Button
              key={index}
              variant={isSelected(coordinate) ? "default" : "outline"}
              size="sm"
              onClick={() => onCoordinateSelect(coordinate)}
              className={cn(
                "flex-shrink-0 flex items-center gap-2 min-w-fit",
                isSelected(coordinate) && "ring-2 ring-primary ring-offset-1"
              )}
            >
              <Clock className="h-3 w-3" />
              <span className="text-xs font-mono">
                {formatDate(coordinate.createdAt)}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
