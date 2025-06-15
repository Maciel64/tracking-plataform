/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { HttpError } from "./http.error";

type HandlerWithParams<TParams> = (
  req: NextRequest,
  context: { params: TParams }
) => Promise<NextResponse>;

export type HandlerWithoutParams = (req: NextRequest) => Promise<NextResponse>;

export function error_middleware(
  handler: HandlerWithoutParams
): HandlerWithoutParams;
export function error_middleware<TParams = Record<string, string>>(
  handler: HandlerWithParams<TParams>
): HandlerWithParams<TParams>;
export function error_middleware(handler: any): any {
  return async (req: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await handler(req, context);
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
  };
}
