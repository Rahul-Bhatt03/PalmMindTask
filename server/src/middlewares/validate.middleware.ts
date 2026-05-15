import type { Request, Response, NextFunction } from "express";
import { fail } from "../utils/response.js";

type FieldRule = "string" | "emailish";

export function validateBody(fields: Record<string, FieldRule>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const body = req.body as Record<string, unknown>;
    for (const [key, rule] of Object.entries(fields)) {
      const value = body[key];
      if (typeof value !== "string" || value.trim() === "") {
        fail(res, `Invalid or missing field: ${key}`, 400);
        return;
      }
      if (rule === "emailish" && !value.includes("@")) {
        fail(res, `Invalid field: ${key}`, 400);
        return;
      }
    }
    next();
  };
}
