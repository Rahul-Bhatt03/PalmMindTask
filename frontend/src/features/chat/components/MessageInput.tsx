import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components";

interface MessageInputProps {
  onSend: (body: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  disabled,
  placeholder = "Type a message…",
}: MessageInputProps) {
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    const trimmed = body.trim();
    if (!trimmed || disabled || isSending) return;

    setIsSending(true);
    setError(null);
    try {
      await onSend(trimmed);
      setBody("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send");
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="shrink-0 border-t border-slate-800 bg-slate-900/80 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4 sm:pb-4"
    >
      {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSending}
          placeholder={placeholder}
          rows={2}
          className="min-h-[2.75rem] w-full flex-1 resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-base text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50 sm:text-sm"
        />
        <Button
          type="submit"
          disabled={disabled || isSending || !body.trim()}
          isLoading={isSending}
          className="w-full shrink-0 sm:w-auto"
        >
          Send
        </Button>
      </div>
    </form>
  );
}
