import Map from "@/components/map";
import { MicrocontrollerCard } from "@/components/microcontroller/microcontroller-card";
import { Microcontrollers } from "@/components/server/microcontrollers";
import * as motion from "motion/react-client";

export default async function Maps() {
  const microcontrollers = await Microcontrollers();

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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {microcontrollers.map((microcontroller) => (
          <MicrocontrollerCard
            key={microcontroller.uid}
            microcontroller={microcontroller}
            map={
              <Map
                center={[
                  microcontroller.coordinates?.[0]?.latitude ?? 0,
                  microcontroller.coordinates?.[0]?.longitude ?? 0,
                ]}
                locations={
                  microcontroller.coordinates?.map((coord) => ({
                    position: [coord.latitude, coord.longitude],
                    name: microcontroller.name,
                  })) ?? []
                }
              />
            }
          />
        ))}
      </div>
    </div>
  );
}
