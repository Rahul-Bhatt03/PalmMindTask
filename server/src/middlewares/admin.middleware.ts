import type { Request, Response, NextFunction } from "express";
import type { IUserRepository } from "../interfaces/repositories/user.repository.interface.js";
import { fail } from "../utils/response.js";

export function createAdminMiddleware(users: IUserRepository) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      fail(res, "Unauthorized", 401);
      return;
    }
    try {
      const actor = await users.findById(req.user.id);
      if (!actor || (actor.role ?? "user") !== "admin") {
        fail(res, "Forbidden", 403);
        return;
      }
      next();
    } catch (e) {
      next(e);
    }
  };
}
