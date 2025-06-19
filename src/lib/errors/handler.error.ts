/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { HttpError } from "./http.error";

export async function error_handler(callback: (...params: any[]) => any) {
  try {
    return await callback();
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
