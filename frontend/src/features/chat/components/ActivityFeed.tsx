import { formatDistanceToNow } from "date-fns";
import type { RoomActivity } from "@/types";

interface ActivityFeedProps {
  activities: RoomActivity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) return null;

  return (
    <div className="shrink-0 border-b border-slate-800 bg-slate-900/40 px-3 py-2 sm:px-4">
      <ul className="flex flex-col gap-1">
        {activities.map((a) => (
          <li key={a.id} className="break-words text-xs text-slate-400">
            <span className="font-medium text-brand-300">{a.label}</span>{" "}
            {a.message}
            <span className="ml-1 block text-slate-600 sm:ml-2 sm:inline">
              {formatDistanceToNow(new Date(a.at), { addSuffix: true })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
