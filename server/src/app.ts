import cors from "cors";
import express from "express";
import type { AuthController } from "./controllers/auth.controller.js";
import type { UserController } from "./controllers/user.controller.js";
import type { ChatController } from "./controllers/chat.controller.js";
import type { StatsController } from "./controllers/stats.controller.js";
import { corsOptions } from "./config/cors.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { createAuthRoutes } from "./routes/auth.routes.js";
import { createUserRoutes } from "./routes/user.routes.js";
import { createChatRoutes } from "./routes/chat.routes.js";
import { createStatsRoutes } from "./routes/stats.routes.js";

import type { IUserRepository } from "./interfaces/repositories/user.repository.interface.js";

export interface AppControllers {
  auth: AuthController;
  user: UserController;
  chat: ChatController;
  stats: StatsController;
}

export interface AppDependencies {
  controllers: AppControllers;
  userRepository: IUserRepository;
}

export function createApp({ controllers, userRepository }: AppDependencies): express.Express {
  const app = express();
  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/auth", createAuthRoutes(controllers.auth));
  app.use("/api/users", createUserRoutes(controllers.user, userRepository));
  app.use("/api/chat", createChatRoutes(controllers.chat));
  app.use("/api/stats", createStatsRoutes(controllers.stats));

  app.use((_req, res) => {
    res.status(404).json({ success: false, error: { message: "Not found" } });
  });

  app.use(errorMiddleware);
  return app;
}
