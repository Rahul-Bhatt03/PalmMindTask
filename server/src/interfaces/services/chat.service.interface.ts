import type { IMessage } from "../repositories/chat.repository.interface.js";

export interface IChatService {
  getMessages(roomId: string): Promise<IMessage[]>;
  postMessage(userId: string, roomId: string, body: string): Promise<IMessage>;
}
