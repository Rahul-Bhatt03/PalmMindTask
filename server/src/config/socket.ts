import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { socketCorsOptions } from "./cors.js";

export function createSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: socketCorsOptions,
  });
  return io;
}
