import type { Request, Response, NextFunction } from "express";
import { fail } from "../utils/response.js";

export function errorMiddleware(
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const status = typeof err.status === "number" ? err.status : 500;
  const message = status === 500 ? "Internal server error" : err.message;
  fail(res, message, status);
}
