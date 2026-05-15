import { cn } from "@/lib";

interface SpinnerProps {
  className?: string;
  label?: string;
}

export function Spinner({ className, label = "Loading" }: SpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"
        role="status"
        aria-label={label}
      />
      {label && <p className="text-sm text-slate-400">{label}</p>}
    </div>
  );
}
