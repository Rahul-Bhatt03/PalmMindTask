import { useCallback, useEffect, useRef, useState } from "react";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  joinRoom,
  onChatMessage,
  onSocketConnect,
  onSocketDisconnect,
  onUserJoined,
  sendChatMessage,
} from "@/sockets";
import type { ChatMessage, RoomActivity, UserJoinedEvent } from "@/types";

interface UseChatSocketOptions {
  roomId: string;
  accessToken: string | null;
  currentUserId: string | undefined;
  onMessage?: (message: ChatMessage) => void;
}

export function useChatSocket({
  roomId,
  accessToken,
  currentUserId,
  onMessage,
}: UseChatSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [activities, setActivities] = useState<RoomActivity[]>([]);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!accessToken || !roomId) {
      return;
    }

    const socket = connectSocket(accessToken);
    setIsConnected(socket.connected);
    setConnectionError(null);

    const unsubConnect = onSocketConnect(socket, () => {
      setIsConnected(true);
      setConnectionError(null);
      joinRoom(socket, roomId);
    });

    const unsubDisconnect = onSocketDisconnect(socket, () => {
      setIsConnected(false);
    });

    const unsubMessage = onChatMessage(socket, (msg) => {
      const normalized: ChatMessage = {
        id: msg.id,
        roomId: msg.roomId,
        senderId: msg.senderId,
        body: msg.body,
        createdAt:
          typeof msg.createdAt === "string"
            ? msg.createdAt
            : new Date(msg.createdAt).toISOString(),
      };
      onMessageRef.current?.(normalized);
    });

    const unsubJoined = onUserJoined(socket, (event: UserJoinedEvent) => {
      if (event.roomId !== roomId) return;
      if (event.userId === currentUserId) return;
      setActivities((prev) => [
        {
          id: `${event.userId}-${Date.now()}`,
          label: event.email,
          message: "joined the room",
          at: new Date().toISOString(),
        },
        ...prev.slice(0, 19),
      ]);
    });

    socket.on("connect_error", (err: Error) => {
      setConnectionError(err.message);
      setIsConnected(false);
    });

    if (socket.connected) {
      joinRoom(socket, roomId);
    }

    return () => {
      unsubConnect();
      unsubDisconnect();
      unsubMessage();
      unsubJoined();
      socket.off("connect_error");
    };
  }, [accessToken, roomId, currentUserId]);

  useEffect(() => {
    return () => {
      const socket = getSocket();
      if (socket && !socket.connected) {
        disconnectSocket();
      }
    };
  }, []);

  const sendMessage = useCallback(
    async (body: string) => {
      const socket = getSocket();
      if (!socket?.connected) {
        throw new Error("Socket not connected");
      }
      const ack = await sendChatMessage(socket, { roomId, body });
      if (!ack.ok) {
        throw new Error(ack.error ?? "Failed to send message");
      }
      return ack;
    },
    [roomId],
  );

  const switchRoom = useCallback(
    (nextRoomId: string) => {
      const socket = getSocket();
      if (socket?.connected) {
        joinRoom(socket, nextRoomId);
      }
    },
    [],
  );

  return {
    isConnected,
    connectionError,
    activities,
    sendMessage,
    switchRoom,
    clearActivities: () => setActivities([]),
  };
}
