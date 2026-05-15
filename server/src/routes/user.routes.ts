import { Router } from "express";
import type { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export function createUserRoutes(controller: UserController): Router {
  const r = Router();
  r.get("/me", authMiddleware, controller.me);
  return r;
}
