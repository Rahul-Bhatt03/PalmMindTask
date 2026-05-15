import type { Request, Response, NextFunction } from "express";
import type { IChatService } from "../interfaces/services/chat.service.interface.js";
import { fail, ok } from "../utils/response.js";

export class ChatController {
  constructor(private readonly chat: IChatService) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roomId = String(req.query.roomId ?? "");
      const messages = await this.chat.getMessages(roomId);
      ok(res, messages);
    } catch (e) {
      next(e);
    }
  };

  send = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        fail(res, "Unauthorized", 401);
        return;
      }
      const { roomId, body } = req.body as { roomId?: string; body?: string };
      const message = await this.chat.postMessage(req.user.id, roomId ?? "", body ?? "");
      ok(res, message, 201);
    } catch (e) {
      next(e);
    }
  };
}
