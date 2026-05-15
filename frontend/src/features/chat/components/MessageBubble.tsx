import { format } from "date-fns";
import { cn } from "@/lib";
import type { ChatMessage } from "@/types";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  senderLabel?: string;
}

export function MessageBubble({ message, isOwn, senderLabel }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-[min(85%,20rem)] flex-col gap-1 sm:max-w-[85%]",
        isOwn ? "ml-auto items-end" : "mr-auto items-start",
      )}
    >
      {!isOwn && senderLabel && (
        <span className="px-1 text-xs font-medium text-slate-400">{senderLabel}</span>
      )}
      <div
        className={cn(
          "rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm",
          isOwn
            ? "rounded-br-md bg-brand-600 text-white"
            : "rounded-bl-md bg-slate-800 text-slate-100",
        )}
      >
        {message.body}
      </div>
      <time className="px-1 text-[10px] text-slate-500" dateTime={message.createdAt}>
        {format(new Date(message.createdAt), "HH:mm")}
      </time>
    </div>
  );
}
