import { Router } from "express";
import type { ChatController } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export function createChatRoutes(controller: ChatController): Router {
  const r = Router();
  r.get("/messages", controller.list);
  r.post(
    "/messages",
    authMiddleware,
    controller.send,
  );
  return r;
}
