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

export function validateBodyPartial(fields: Record<string, FieldRule>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const body = req.body as Record<string, unknown>;
    const provided = Object.keys(fields).filter((key) => body[key] !== undefined);

    if (provided.length === 0) {
      fail(res, "At least one field is required", 400);
      return;
    }

    for (const key of provided) {
      const value = body[key];
      const rule = fields[key];
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
