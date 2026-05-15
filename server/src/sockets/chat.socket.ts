import type { Server } from "socket.io";
import { verifyToken } from "../utils/jwt.js";
import type { IChatRepository } from "../interfaces/repositories/chat.repository.interface.js";
import { Types } from "mongoose";

export function registerChatSockets(io: Server, chatRepo: IChatRepository): void {
  io.use((socket, next) => {
    const token =
      (socket.handshake.auth as { token?: string })?.token ??
      (typeof socket.handshake.query.token === "string" ? socket.handshake.query.token : undefined);
    if (!token) {
      next(new Error("Unauthorized"));
      return;
    }
    try {
      const claims = verifyToken(token);
      socket.data.userId = claims.sub;
      socket.data.email = claims.email;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join_room", (roomId: string) => {
      if (typeof roomId === "string" && roomId.trim()) {
        const trimmed = roomId.trim();
        void socket.join(trimmed);
        socket.to(trimmed).emit("user:joined", {
          userId: socket.data.userId as string,
          email: socket.data.email as string,
          roomId: trimmed,
        });
      }
    });

    socket.on("chat:message", async (payload: { roomId?: string; body?: string }, ack) => {
      const userId = socket.data.userId as string;
      const roomId = typeof payload?.roomId === "string" ? payload.roomId.trim() : "";
      const body = typeof payload?.body === "string" ? payload.body.trim() : "";
      if (!roomId || !body) {
        ack?.({ ok: false, error: "roomId and body required" });
        return;
      }
      try {
        const msg = await chatRepo.createMessage({
          roomId,
          senderId: new Types.ObjectId(userId),
          body,
        });
        io.to(roomId).emit("chat:message", {
          id: msg._id.toString(),
          roomId: msg.roomId,
          senderId: msg.senderId.toString(),
          body: msg.body,
          createdAt: msg.createdAt,
        });
        ack?.({ ok: true, id: msg._id.toString() });
      } catch (e) {
        ack?.({ ok: false, error: e instanceof Error ? e.message : "error" });
      }
    });
  });
}
