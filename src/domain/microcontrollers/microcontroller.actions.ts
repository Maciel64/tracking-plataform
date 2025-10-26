"use server";

import { revalidatePath } from "next/cache";
import { HttpError } from "@/lib/errors/http.error";
import type {
  CreateMicrocontrollerSchema,
  UpdateMicrocontrollerSchema,
} from "@/schemas/microcontroller.schema";
import { getMicrocontrollerService } from "./microcontroller.hooks";

export async function createMicrocontroller(
  userId: string,
  data: CreateMicrocontrollerSchema,
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
  enterpriseId: string,
  id: string,
  data: UpdateMicrocontrollerSchema,
) {
  const result = await getMicrocontrollerService().update(
    userId,
    enterpriseId,
    id,
    data,
  );

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
