import type { ReactNode } from "react";
import { cn } from "@/lib";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "online" | "offline";
  className?: string;
}

const variants = {
  default: "bg-slate-800 text-slate-200",
  online: "bg-emerald-900/60 text-emerald-300 ring-1 ring-emerald-500/40",
  offline: "bg-slate-800 text-slate-400",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {variant === "online" && (
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
      )}
      {children}
    </span>
  );
}
