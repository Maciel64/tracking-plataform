"use server";

import { MicrocontrollerSchema } from "@/schemas/microcontroller.schema";
import { getMicrocontrollerService } from "./microcontroller.hooks";
import { revalidatePath } from "next/cache";
import { HttpError } from "@/lib/errors/http.error";

export async function createMicrocontroller(
  userId: string,
  data: MicrocontrollerSchema
) {
  const result = await getMicrocontrollerService().create(userId, data);

  if (result instanceof HttpError) {
    return {
      success: false,
      message: result.message,
    };
  }

  revalidatePath("/microcontrollers");

  return {
    success: true,
    message: "Microcontrolador criado com sucesso",
  };
}

export async function updateMicrocontroller(
  userId: string,
  id: string,
  data: MicrocontrollerSchema
) {
  const result = await getMicrocontrollerService().update(userId, id, data);

  if (result instanceof HttpError) {
    return {
      success: false,
      message: result.message,
    };
  }

  revalidatePath("/microcontrollers");

  return {
    success: true,
    message: "Microcontrolador atualizado com sucesso",
  };
}

export async function deleteMicrocontroller(userId: string, id: string) {
  const result = await getMicrocontrollerService().delete(userId, id);

  if (result instanceof HttpError) {
    return {
      success: false,
      message: result.message,
    };
  }

  revalidatePath("/microcontrollers");

  return {
    success: true,
    message: "Microcontrolador deletado com sucesso",
  };
}
