import { Router } from "express";
import type { UserController } from "../controllers/user.controller.js";
import type { IUserRepository } from "../interfaces/repositories/user.repository.interface.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createAdminMiddleware } from "../middlewares/admin.middleware.js";
import { validateBodyPartial } from "../middlewares/validate.middleware.js";

export function createUserRoutes(
  controller: UserController,
  users: IUserRepository,
): Router {
  const r = Router();
  const adminOnly = createAdminMiddleware(users);

  r.get("/me", authMiddleware, controller.me);
  r.get("/", authMiddleware, adminOnly, controller.list);
  r.get("/:id", authMiddleware, controller.getById);
  r.put(
    "/:id",
    authMiddleware,
    validateBodyPartial({
      displayName: "string",
      email: "emailish",
    }),
    controller.update,
  );
  r.delete("/:id", authMiddleware, adminOnly, controller.remove);

  return r;
}
