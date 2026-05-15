import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";
import { fail } from "../utils/response.js";

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: number }).code === 11000
  );
}

function resolveStatus(err: Error & { status?: number }): number {
  if (typeof err.status === "number") return err.status;
  if (isDuplicateKeyError(err)) return 409;
  return 500;
}

function resolveMessage(err: Error, status: number): string {
  if (isDuplicateKeyError(err)) {
    const msg = err.message;
    if (msg.includes("email")) return "Email already registered";
    return "Resource already exists";
  }
  if (status === 500 && env.NODE_ENV === "production") {
    return "Internal server error";
  }
  if (status === 500) {
    return err.message || "Internal server error";
  }
  return err.message;
}

export function errorMiddleware(
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const status = resolveStatus(err);
  const message = resolveMessage(err, status);

  if (env.NODE_ENV !== "production") {
    console.error("[error]", status, err.message, err.stack);
  }

  fail(res, message, status);
}
