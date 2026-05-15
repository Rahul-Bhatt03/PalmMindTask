import { useMemo, type RefObject } from "react";
import { EmptyState, Spinner } from "@/components";
import type { ChatMessage } from "@/types";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  isLoading?: boolean;
  error?: string | null;
  containerRef: RefObject<HTMLDivElement>;
  onScroll: () => void;
}

export function MessageList({
  messages,
  currentUserId,
  isLoading,
  error,
  containerRef,
  onScroll,
}: MessageListProps) {
  const grouped = useMemo(() => messages, [messages]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner label="Loading messages…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-red-400">
        {error}
      </div>
    );
  }

  if (grouped.length === 0) {
    return (
      <EmptyState
        title="No messages yet"
        description="Be the first to say hello in this room."
        icon="💬"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className="scrollbar-thin flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 sm:p-4"
    >
      {grouped.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isOwn={msg.senderId === currentUserId}
          senderLabel={
            msg.senderId === currentUserId ? undefined : msg.senderId.slice(-6)
          }
        />
      ))}
    </div>
  );
}
