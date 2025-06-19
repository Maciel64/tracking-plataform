"use server";

import { CreateUserSchema } from "@/schemas/user.schema";
import { getUserService } from "./user.hooks";
import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { HttpError } from "@/lib/errors/http.error";

export async function register(data: CreateUserSchema) {
  try {
    const usersService = getUserService();

    return usersService.create(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: error.errors.map((e) => e.message),
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        message:
          error instanceof HttpError || error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      { status: error instanceof HttpError ? error.statusCode : 500 }
    );
  }
}
