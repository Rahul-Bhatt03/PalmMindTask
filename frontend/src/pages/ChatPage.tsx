import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_ROOMS } from "@/constants";
import {
  ActivityFeed,
  ChatHeader,
  MessageInput,
  MessageList,
  RoomSidebar,
} from "@/features/chat";
import { useAuth, useAutoScroll, useChatSocket } from "@/hooks";
import { chatService, statsService } from "@/services";
import type { AppStats, ChatMessage } from "@/types";
import { getErrorMessage } from "@/utils";

export function ChatPage() {
  const { user, accessToken, signOut } = useAuth();
  const [activeRoomId, setActiveRoomId] = useState<string>(DEFAULT_ROOMS[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [stats, setStats] = useState<AppStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeRoom = useMemo(
    () => DEFAULT_ROOMS.find((r) => r.id === activeRoomId) ?? DEFAULT_ROOMS[0],
    [activeRoomId],
  );

  const handleIncomingMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === message.id)) return prev;
      return [...prev, message];
    });
  }, []);

  const { containerRef, checkNearBottom } = useAutoScroll<HTMLDivElement>([
    messages.length,
    activeRoomId,
  ]);

  const {
    isConnected,
    connectionError,
    activities,
    sendMessage,
    switchRoom,
    clearActivities,
  } = useChatSocket({
    roomId: activeRoomId,
    accessToken,
    currentUserId: user?.id,
    onMessage: handleIncomingMessage,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadMessages() {
      setIsLoadingMessages(true);
      setMessagesError(null);
      try {
        const data = await chatService.getMessages(activeRoomId);
        if (!cancelled) setMessages(data);
      } catch (e) {
        if (!cancelled) {
          setMessagesError(getErrorMessage(e, "Failed to load messages"));
        }
      } finally {
        if (!cancelled) setIsLoadingMessages(false);
      }
    }

    void loadMessages();
    return () => {
      cancelled = true;
    };
  }, [activeRoomId]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      setStatsLoading(true);
      try {
        const data = await statsService.getStats();
        if (!cancelled) setStats(data);
      } catch {
        if (!cancelled) setStats(null);
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    }

    void loadStats();
    const interval = setInterval(() => void loadStats(), 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const handleRoomChange = (roomId: string) => {
    if (roomId === activeRoomId) return;
    setActiveRoomId(roomId);
    setMessages([]);
    clearActivities();
    switchRoom(roomId);
  };

  if (!user) return null;

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <RoomSidebar
        activeRoomId={activeRoomId}
        onSelectRoom={handleRoomChange}
        stats={stats}
        statsLoading={statsLoading}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        <ChatHeader
          user={user}
          roomLabel={activeRoom.label}
          isConnected={isConnected}
          onLogout={signOut}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        {connectionError && (
          <p className="shrink-0 bg-amber-950/50 px-3 py-2 text-xs text-amber-200 sm:px-4">
            Connection issue: {connectionError}
          </p>
        )}

        <ActivityFeed activities={activities} />

        <MessageList
          messages={messages}
          currentUserId={user.id}
          isLoading={isLoadingMessages}
          error={messagesError}
          containerRef={containerRef}
          onScroll={checkNearBottom}
        />

        <MessageInput
          onSend={async (body) => {
            await sendMessage(body);
          }}
          disabled={!isConnected}
          placeholder={
            isConnected ? `Message #${activeRoom.label}…` : "Connecting…"
          }
        />
      </main>
    </div>
  );
}
