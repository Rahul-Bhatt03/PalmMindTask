import type { IChatService } from "../interfaces/services/chat.service.interface.js";
import type { IChatRepository } from "../interfaces/repositories/chat.repository.interface.js";
import type { IUserRepository } from "../interfaces/repositories/user.repository.interface.js";
import { Types } from "mongoose";

export class ChatService implements IChatService {
  constructor(
    private readonly chat: IChatRepository,
    private readonly users: IUserRepository,
  ) {}

  async getMessages(roomId: string) {
    if (!roomId?.trim()) {
      throw Object.assign(new Error("roomId is required"), { status: 400 });
    }
    return this.chat.listMessages(roomId.trim());
  }

  async postMessage(userId: string, roomId: string, body: string) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }
    const trimmedRoom = roomId?.trim();
    const trimmedBody = body?.trim();
    if (!trimmedRoom || !trimmedBody) {
      throw Object.assign(new Error("roomId and body are required"), { status: 400 });
    }
    return this.chat.createMessage({
      roomId: trimmedRoom,
      senderId: new Types.ObjectId(userId),
      body: trimmedBody,
    });
  }
}
