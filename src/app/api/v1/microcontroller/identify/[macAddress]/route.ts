import { getMicrocontrollerService } from "@/domain/microcontrollers/microcontroller.hooks";
import { HttpError, UnprocessableEntityError } from "@/lib/errors/http.error";
import { error_middleware } from "@/lib/errors/midleware.error";
import { NextRequest, NextResponse } from "next/server";

// export const dynamic = "force-static";

export const GET = error_middleware(
  async (
    request: NextRequest,
    context: { params: Promise<{ macAddress: string }> }
  ) => {
    const { macAddress } = await context.params;

    if (!macAddress) {
      throw new UnprocessableEntityError("MAC Address not provided");
    }

    const micro = await getMicrocontrollerService().findByMacAddress(
      macAddress
    );

    if (micro instanceof HttpError) {
      return NextResponse.json(
        { message: micro.message, success: false },
        { status: micro.statusCode }
      );
    }

    return NextResponse.json(
      {
        message: "Microcontroller found",
        data: micro,
      },
      { status: 200 }
    );
  }
);
