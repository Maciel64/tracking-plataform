import { getMicrocontrollerService } from "@/domain/microcontrollers/microcontroller.hooks";
import { error_middleware } from "@/lib/errors/midleware.error";
import { NextResponse } from "next/server";

export const GET = error_middleware(
  async (req: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;

    return NextResponse.json(
      await getMicrocontrollerService().getOneWithLatestCoordinates(id),
      {
        status: 200,
      }
    );
  }
);
