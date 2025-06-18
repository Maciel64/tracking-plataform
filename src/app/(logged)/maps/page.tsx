import { MapsContent } from "@/components/map/maps-content";
import { MapsSkeleton } from "@/components/map/maps-skeleton";
import { getMicrocontrollerService } from "@/domain/microcontrollers/microcontroller.hooks";
import * as motion from "motion/react-client";
import { Suspense } from "react";

export default async function Maps() {
  const microcontrollersPromise =
    getMicrocontrollerService().getWithLatestCoordinates();

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Mapas ativos
          </span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Confira as localizações ativas dos rastreadores.
        </p>
      </motion.div>

      <Suspense fallback={<MapsSkeleton />}>
        <MapsContent microcontrollersPromise={microcontrollersPromise} />
      </Suspense>
    </div>
  );
}
