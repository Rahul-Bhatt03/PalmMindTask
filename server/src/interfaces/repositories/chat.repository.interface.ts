import type { Types } from "mongoose";

export interface IMessage {
  _id: Types.ObjectId;
  roomId: string;
  senderId: Types.ObjectId;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMessageInput {
  roomId: string;
  senderId: Types.ObjectId;
  body: string;
}

export interface IChatRepository {
  listMessages(roomId: string, limit?: number): Promise<IMessage[]>;
  createMessage(input: CreateMessageInput): Promise<IMessage>;
  countMessages(): Promise<number>;
}
