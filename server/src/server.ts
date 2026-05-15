import http from "http";
import { createApp } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { createSocketServer } from "./config/socket.js";
import { AuthController } from "./controllers/auth.controller.js";
import { ChatController } from "./controllers/chat.controller.js";
import { StatsController } from "./controllers/stats.controller.js";
import { UserController } from "./controllers/user.controller.js";
import { ChatRepository } from "./repositories/chat.repository.js";
import { UserRepository } from "./repositories/user.repository.js";
import { AuthService } from "./services/auth.service.js";
import { ChatService } from "./services/chat.service.js";
import { StatsService } from "./services/stats.service.js";
import { UserService } from "./services/user.service.js";
import { registerChatSockets } from "./sockets/chat.socket.js";

async function main(): Promise<void> {
  await connectDb();

  const userRepo = new UserRepository();
  const chatRepo = new ChatRepository();

  const authService = new AuthService(userRepo);
  const userService = new UserService(userRepo);
  const chatService = new ChatService(chatRepo, userRepo);
  const statsService = new StatsService(userRepo, chatRepo);

  const app = createApp({
    controllers: {
      auth: new AuthController(authService),
      user: new UserController(userService),
      chat: new ChatController(chatService),
      stats: new StatsController(statsService),
    },
    userRepository: userRepo,
  });

  const httpServer = http.createServer(app);
  const io = createSocketServer(httpServer);
  registerChatSockets(io, chatRepo);

  httpServer.listen(env.PORT, () => {
    console.log(`HTTP listening on port ${env.PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
