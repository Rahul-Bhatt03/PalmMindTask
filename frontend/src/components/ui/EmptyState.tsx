import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      {icon && <div className="text-4xl opacity-60">{icon}</div>}
      <h3 className="text-lg font-medium text-slate-200">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-slate-400">{description}</p>
      )}
    </div>
  );
}
