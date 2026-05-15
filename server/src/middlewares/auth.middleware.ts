import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { fail } from "../utils/response.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) {
    fail(res, "Missing bearer token", 401);
    return;
  }
  try {
    const claims = verifyToken(token);
    req.user = { id: claims.sub, email: claims.email };
    next();
  } catch {
    fail(res, "Invalid or expired token", 401);
  }
}
