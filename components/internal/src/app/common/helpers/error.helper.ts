import { NextResponse } from "next/server";
import { UnauthorizedError } from "@/app/[locale]/(consumer)/domain/errors/unauthorized-error.ts";
import { BadRequestError } from "@/app/[locale]/(consumer)/domain/errors/bad-request-error.ts";

export class CustomError extends Error {
  constructor(message: string, errorCode?: number, httpStatusCode?: number) {
    super(message);
    this.httpStatusCode = httpStatusCode;
    this.errorCode = errorCode;
  }

  httpStatusCode?: number = 500; // HTTP client error codes lies between 400-500
  errorCode?: number; // our internal codes - optional in some cases
}

export function errorHandler(err: any) {
  if (err instanceof UnauthorizedError) {
    return NextResponse.json({ message: err.message }, { status: 401 });
  }
  if (err instanceof BadRequestError) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
  if (!err.httpStatusCode || err.httpStatusCode >= 500) {
    //defaults to 500
    err.httpStatusCode = 500;
    err.message = "Internal Server Error";
  }
  return NextResponse.json(
    { message: err.message },
    { status: err.httpStatusCode }
  );
}
