import type { Request, Response, NextFunction } from "express";
import type { IAuthService } from "../interfaces/services/auth.service.interface.js";
import { ok } from "../utils/response.js";

export class AuthController {
  constructor(private readonly auth: IAuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.auth.register(req.body);
      ok(res, result, 201);
    } catch (e) {
      next(e);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.auth.login(req.body);
      ok(res, result);
    } catch (e) {
      next(e);
    }
  };
}
