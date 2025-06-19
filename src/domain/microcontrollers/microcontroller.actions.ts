"use server";

import { MicrocontrollerSchema } from "@/schemas/microcontroller.schema";
import { getMicrocontrollerService } from "./microcontroller.hooks";
import { revalidatePath } from "next/cache";
import { error_handler } from "@/lib/errors/handler.error";

export async function createMicrocontroller(
  userId: string,
  data: MicrocontrollerSchema
) {
  return error_handler(async () => {
    await getMicrocontrollerService().create(userId, data);

    revalidatePath("/microcontrollers");

    return {
      success: true,
      message: "Microcontrolador criado com sucesso",
    };
  });
}

export async function updateMicrocontroller(
  userId: string,
  id: string,
  data: MicrocontrollerSchema
) {
  return error_handler(async () => {
    await getMicrocontrollerService().update(userId, id, data);

    revalidatePath("/microcontrollers");

    return {
      success: true,
      message: "Microcontrolador atualizado com sucesso",
    };
  });
}

export async function deleteMicrocontroller(userId: string, id: string) {
  return error_handler(async () => {
    await getMicrocontrollerService().delete(userId, id);

    revalidatePath("/microcontrollers");

    return {
      success: true,
      message: "Microcontrolador deletado com sucesso",
    };
  });
}
