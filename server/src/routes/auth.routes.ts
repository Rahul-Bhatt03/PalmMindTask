import { Router } from "express";
import type { AuthController } from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validate.middleware.js";

export function createAuthRoutes(controller: AuthController): Router {
  const r = Router();
  r.post(
    "/register",
    validateBody({
      email: "emailish",
      password: "string",
      displayName: "string",
    }),
    controller.register,
  );
  r.post(
    "/login",
    validateBody({
      email: "emailish",
      password: "string",
    }),
    controller.login,
  );
  return r;
}
