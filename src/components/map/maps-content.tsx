"use client";

import { Microcontroller } from "@/domain/microcontrollers/microcontroller.model";
import { use, useState } from "react";
import { MicrocontrollerCard } from "../microcontroller/microcontroller-card";
import Map from ".";
import { MicrocontrollerModal } from "../microcontroller/microcontroller-modal";

interface MapsContentProps {
  microcontrollersPromise: Promise<Microcontroller[]>;
}

export function MapsContent({ microcontrollersPromise }: MapsContentProps) {
  const microcontrollers = use(microcontrollersPromise);
  const [microcontroller, setMicrocontroller] =
    useState<Microcontroller | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {microcontrollers.map((microcontroller) => (
          <MicrocontrollerCard
            key={microcontroller.id}
            microcontroller={microcontroller}
            map={
              <Map
                showZoomControls={false}
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
            setMicrocontroller={setMicrocontroller}
            setIsModalOpen={setIsModalOpen}
          />
        ))}
      </div>

      <MicrocontrollerModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        microcontroller={microcontroller}
        setMicrocontroller={setMicrocontroller}
      />
    </>
  );
}
