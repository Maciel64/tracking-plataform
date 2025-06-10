import { MicrocontrollerTable } from "@/components/microcontroller/microcontroller-table";
import { getMicrocontrollerService } from "@/domain/microcontrollers/microcontroller.hooks";

import { Cpu } from "lucide-react";
import { Suspense } from "react";

export default function MicrocontrollersPage() {
  const microcontrollersPromise = getMicrocontrollerService().findMany();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Microcontroladores
        </span>
      </h1>
      <p className="mt-2 text-muted-foreground pb-4">
        Gerencie todos os microcontroladores
      </p>

      <div className="border rounded-lg p-4 bg-card overflow-auto">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Lista de microcontroladores</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Microcontroladores cadastrados
        </p>

        <Suspense fallback={<div>Carregando...</div>}>
          <MicrocontrollerTable
            microcontrollersPromise={microcontrollersPromise}
          />
        </Suspense>
      </div>
    </div>
  );
}
