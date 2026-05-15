export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  body: string;
  createdAt: string;
}

export interface ChatMessagePayload {
  roomId: string;
  body: string;
}

export interface SocketChatMessage extends ChatMessage {}

export interface UserJoinedEvent {
  userId: string;
  email: string;
  roomId: string;
}

export interface SocketMessageAck {
  ok: boolean;
  id?: string;
  error?: string;
}

export interface RoomActivity {
  id: string;
  label: string;
  message: string;
  at: string;
}
