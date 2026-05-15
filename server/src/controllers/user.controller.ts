import type { Request, Response, NextFunction } from "express";
import type { IUserService } from "../interfaces/services/user.service.interface.js";
import { fail, ok } from "../utils/response.js";

const UPDATABLE_FIELDS = ["displayName", "email"] as const;

function parsePagination(query: Request["query"]): { page: number; limit: number } {
  const page = Math.max(1, Number.parseInt(String(query.page ?? "1"), 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(String(query.limit ?? "20"), 10) || 20),
  );
  return { page, limit };
}

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

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        fail(res, "Unauthorized", 401);
        return;
      }
      const { page, limit } = parsePagination(req.query);
      const result = await this.users.listUsers(req.user.id, page, limit);
      ok(res, result);
    } catch (e) {
      next(e);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        fail(res, "Unauthorized", 401);
        return;
      }
      const user = await this.users.getUserById(req.user.id, req.params.id);
      ok(res, user);
    } catch (e) {
      next(e);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        fail(res, "Unauthorized", 401);
        return;
      }

      const body = req.body as Record<string, unknown>;
      const extraKeys = Object.keys(body).filter(
        (k) => !UPDATABLE_FIELDS.includes(k as (typeof UPDATABLE_FIELDS)[number]),
      );
      if (extraKeys.length > 0) {
        fail(res, "Cannot update protected fields", 400);
        return;
      }

      const user = await this.users.updateUser(req.user.id, req.params.id, {
        displayName:
          typeof body.displayName === "string" ? body.displayName : undefined,
        email: typeof body.email === "string" ? body.email : undefined,
      });
      ok(res, user);
    } catch (e) {
      next(e);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        fail(res, "Unauthorized", 401);
        return;
      }
      await this.users.deleteUser(req.user.id, req.params.id);
      ok(res, { deleted: true });
    } catch (e) {
      next(e);
    }
  };
}
