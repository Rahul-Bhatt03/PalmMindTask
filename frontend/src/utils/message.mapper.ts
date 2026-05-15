import type { ChatMessage } from "@/types";

interface RawMessage {
  _id?: string;
  id?: string;
  roomId: string;
  senderId: string | { toString(): string };
  body: string;
  createdAt: string | Date;
}

export function mapMessage(raw: RawMessage): ChatMessage {
  return {
    id: raw.id ?? raw._id?.toString() ?? "",
    roomId: raw.roomId,
    senderId:
      typeof raw.senderId === "string" ? raw.senderId : raw.senderId.toString(),
    body: raw.body,
    createdAt:
      raw.createdAt instanceof Date
        ? raw.createdAt.toISOString()
        : String(raw.createdAt),
  };
}
