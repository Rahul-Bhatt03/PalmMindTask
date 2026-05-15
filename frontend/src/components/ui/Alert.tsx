import type { ReactNode } from "react";
import { cn } from "@/lib";

type AlertVariant = "error" | "info" | "success";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

const styles: Record<AlertVariant, string> = {
  error: "border-red-500/40 bg-red-950/40 text-red-200",
  info: "border-brand-500/40 bg-brand-950/40 text-brand-100",
  success: "border-emerald-500/40 bg-emerald-950/40 text-emerald-200",
};

export function Alert({
  variant = "info",
  title,
  children,
  className,
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn("rounded-lg border px-4 py-3 text-sm", styles[variant], className)}
    >
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div>{children}</div>
    </div>
  );
}
