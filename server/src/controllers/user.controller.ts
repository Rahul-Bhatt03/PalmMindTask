import type { Request, Response, NextFunction } from "express";
import type { IUserService } from "../interfaces/services/user.service.interface.js";
import { fail, ok } from "../utils/response.js";

export class UserController {
  constructor(private readonly users: IUserService) {}

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        fail(res, "Unauthorized", 401);
        return;
      }
      const profile = await this.users.getProfile(req.user.id);
      ok(res, profile);
    } catch (e) {
      next(e);
    }
  };
}
