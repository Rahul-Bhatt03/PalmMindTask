import { MessageModel } from "../models/message.model.js";
import type {
  CreateMessageInput,
  IChatRepository,
  IMessage,
} from "../interfaces/repositories/chat.repository.interface.js";

export class ChatRepository implements IChatRepository {
  async listMessages(roomId: string, limit = 50): Promise<IMessage[]> {
    const docs = await MessageModel.find({ roomId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return docs.reverse() as IMessage[];
  }

  async createMessage(input: CreateMessageInput): Promise<IMessage> {
    const doc = await MessageModel.create(input);
    const obj = doc.toObject();
    return { ...obj, _id: doc._id } as IMessage;
  }

  async countMessages(): Promise<number> {
    return MessageModel.countDocuments();
  }
}
