import { cn } from "@/lib";
import { DEFAULT_ROOMS } from "@/constants";
import type { AppStats } from "@/types";

interface RoomSidebarProps {
  activeRoomId: string;
  onSelectRoom: (roomId: string) => void;
  stats?: AppStats | null;
  statsLoading?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function RoomSidebar({
  activeRoomId,
  onSelectRoom,
  stats,
  statsLoading,
  isOpen = false,
  onClose,
}: RoomSidebarProps) {
  const handleSelect = (roomId: string) => {
    onSelectRoom(roomId);
    onClose?.();
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close rooms menu"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "flex w-[min(100vw-3rem,18rem)] shrink-0 flex-col border-r border-slate-800 bg-slate-900/95 backdrop-blur-sm",
          "fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-out lg:relative lg:z-auto lg:w-64 lg:translate-x-0 lg:bg-slate-900/50",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-4 lg:block">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Rooms
          </h2>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 lg:hidden"
            aria-label="Close rooms"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {DEFAULT_ROOMS.map((room) => (
            <button
              key={room.id}
              type="button"
              onClick={() => handleSelect(room.id)}
              className={cn(
                "mb-1 w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                activeRoomId === room.id
                  ? "bg-brand-600/20 text-brand-200 ring-1 ring-brand-500/40"
                  : "text-slate-300 hover:bg-slate-800",
              )}
            >
              <span className="block font-medium">{room.label}</span>
              <span className="mt-0.5 block text-xs text-slate-500">{room.description}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-4 text-xs text-slate-500">
          {statsLoading ? (
            <span>Loading stats…</span>
          ) : stats ? (
            <dl className="grid grid-cols-2 gap-2">
              <div>
                <dt className="text-slate-600">Users</dt>
                <dd className="text-lg font-semibold text-slate-200">{stats.users}</dd>
              </div>
              <div>
                <dt className="text-slate-600">Messages</dt>
                <dd className="text-lg font-semibold text-slate-200">{stats.messages}</dd>
              </div>
            </dl>
          ) : null}
        </div>
      </aside>
    </>
  );
}
