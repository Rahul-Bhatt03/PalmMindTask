import type { Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "@/constants";
import type {
  SocketChatMessage,
  SocketMessageAck,
  UserJoinedEvent,
} from "@/types";

export function joinRoom(socket: Socket, roomId: string): void {
  socket.emit(SOCKET_EVENTS.joinRoom, roomId);
}

export function sendChatMessage(
  socket: Socket,
  payload: { roomId: string; body: string },
): Promise<SocketMessageAck> {
  return new Promise((resolve) => {
    socket.emit(
      SOCKET_EVENTS.chatMessage,
      payload,
      (ack: SocketMessageAck) => {
        resolve(ack ?? { ok: false, error: "No acknowledgment" });
      },
    );
  });
}

export function onChatMessage(
  socket: Socket,
  handler: (message: SocketChatMessage) => void,
): () => void {
  const listener = (message: SocketChatMessage) => handler(message);
  socket.on(SOCKET_EVENTS.chatMessage, listener);
  return () => socket.off(SOCKET_EVENTS.chatMessage, listener);
}

export function onUserJoined(
  socket: Socket,
  handler: (event: UserJoinedEvent) => void,
): () => void {
  const listener = (event: UserJoinedEvent) => handler(event);
  socket.on(SOCKET_EVENTS.userJoined, listener);
  return () => socket.off(SOCKET_EVENTS.userJoined, listener);
}

export function onSocketConnect(
  socket: Socket,
  handler: () => void,
): () => void {
  socket.on("connect", handler);
  return () => socket.off("connect", handler);
}

export function onSocketDisconnect(
  socket: Socket,
  handler: (reason: string) => void,
): () => void {
  const listener = (reason: string) => handler(reason);
  socket.on("disconnect", listener);
  return () => socket.off("disconnect", listener);
}
