import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button } from "@/components";
import { cn } from "@/lib";
import type { AuthUser } from "@/types";

interface ChatHeaderProps {
  user: AuthUser;
  roomLabel: string;
  isConnected: boolean;
  onLogout: () => void;
  onOpenSidebar?: () => void;
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChatHeader({
  user,
  roomLabel,
  isConnected,
  onLogout,
  onOpenSidebar,
}: ChatHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointer = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointer);
    return () => document.removeEventListener("mousedown", handlePointer);
  }, [menuOpen]);

  const initials = user.displayName.charAt(0).toUpperCase();

  const navLinks = (
    <>
      <Link
        to="/profile"
        className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 lg:px-0 lg:py-0 lg:hover:bg-transparent"
        onClick={() => setMenuOpen(false)}
      >
        Profile
      </Link>
      {user.role === "admin" && (
        <Link
          to="/users"
          className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 lg:px-0 lg:py-0 lg:hover:bg-transparent"
          onClick={() => setMenuOpen(false)}
        >
          Users
        </Link>
      )}
    </>
  );

  return (
    <header className="shrink-0 border-b border-slate-800 bg-slate-900/80 px-3 py-2 sm:px-4 sm:py-3">
      <div className="flex items-center gap-2 sm:gap-3">
        {onOpenSidebar && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 px-2 lg:hidden"
            aria-label="Open rooms"
            onClick={onOpenSidebar}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        )}

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold text-slate-100 sm:text-lg">
            #{roomLabel}
          </h1>
          <div className="mt-0.5 flex items-center gap-2">
            <Badge variant={isConnected ? "online" : "offline"}>
              {isConnected ? "Live" : "Reconnecting…"}
            </Badge>
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <div className="max-w-[140px] truncate text-right xl:max-w-none">
            <p className="truncate text-sm font-medium text-slate-200">{user.displayName}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white"
            title={user.displayName}
          >
            {initials}
          </div>
          <Link to="/profile">
            <Button variant="ghost" size="sm" type="button">
              Profile
            </Button>
          </Link>
          {user.role === "admin" && (
            <Link to="/users">
              <Button variant="ghost" size="sm" type="button">
                Users
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="sm" onClick={onLogout}>
            Logout
          </Button>
        </div>

        {/* Mobile / tablet menu */}
        <div ref={menuRef} className="relative lg:hidden">
          <button
            type="button"
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white",
              menuOpen && "ring-2 ring-brand-400 ring-offset-2 ring-offset-slate-900",
            )}
            aria-label="Account menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {initials}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-slate-700 bg-slate-900 py-2 shadow-xl">
              <div className="border-b border-slate-800 px-3 pb-2">
                <p className="truncate text-sm font-medium text-slate-200">{user.displayName}</p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
              <nav className="flex flex-col gap-0.5 px-2 pt-2">{navLinks}</nav>
              <div className="mt-2 border-t border-slate-800 px-2 pt-2">
                <button
                  type="button"
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-300 hover:bg-slate-800"
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
    </header>
  );
}
