import { getCoordinatesService } from "@/domain/coordinates/coordinate.hooks";
import { error_middleware } from "@/lib/errors/midleware.error";
import {
  CreateCoordinateSchema,
  createCoordinateSchema,
} from "@/schemas/coordinate.schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = error_middleware(async (request: NextRequest) => {
  const body: CreateCoordinateSchema = await request.json();

  createCoordinateSchema.parse(body);

  const coordinate = await getCoordinatesService().create(body);

  return NextResponse.json(
    { message: "Coordinate created successfuly", data: coordinate },
    { status: 201 }
  );
});
