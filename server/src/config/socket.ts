import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { env } from "./env.js";

export function createSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
      methods: ["GET", "POST"],
    },
  });
  return io;
}
