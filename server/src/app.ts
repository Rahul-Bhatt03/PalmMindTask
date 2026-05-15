import cors from "cors";
import express from "express";
import type { AuthController } from "./controllers/auth.controller.js";
import type { UserController } from "./controllers/user.controller.js";
import type { ChatController } from "./controllers/chat.controller.js";
import type { StatsController } from "./controllers/stats.controller.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { createAuthRoutes } from "./routes/auth.routes.js";
import { createUserRoutes } from "./routes/user.routes.js";
import { createChatRoutes } from "./routes/chat.routes.js";
import { createStatsRoutes } from "./routes/stats.routes.js";
import { env } from "./config/env.js";

export interface AppControllers {
  auth: AuthController;
  user: UserController;
  chat: ChatController;
  stats: StatsController;
}

export function createApp(controllers: AppControllers): express.Express {
  const app = express();
  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/auth", createAuthRoutes(controllers.auth));
  app.use("/api/users", createUserRoutes(controllers.user));
  app.use("/api/chat", createChatRoutes(controllers.chat));
  app.use("/api/stats", createStatsRoutes(controllers.stats));

  app.use((_req, res) => {
    res.status(404).json({ success: false, error: { message: "Not found" } });
  });

  app.use(errorMiddleware);
  return app;
}
