import { CoordinatesRepository } from "@/domain/coordinates/coordinates.repository";
import { CoordinatesService } from "@/domain/coordinates/coordinates.service";
import { firestoreAdapter } from "@/lib/adapters/firebase.adapter";
import { createCoordinateSchema } from "@/schemas/coordinate.schema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

const coordinatesRepository = new CoordinatesRepository(firestoreAdapter);
const coordinatesService = new CoordinatesService(coordinatesRepository);

export async function GET() {
  const coordinates = await coordinatesService.find();
  return NextResponse.json(coordinates);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    createCoordinateSchema.parse(data);

    const coordinate = await coordinatesService.create(data);

    return NextResponse.json(coordinate, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: JSON.parse(e.message) },
        { status: 500 }
      );
    }
  }
}
