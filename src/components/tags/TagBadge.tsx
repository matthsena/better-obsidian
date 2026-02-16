import React from "react";

interface Props {
  name: string;
  color: string;
  count?: number;
  onClick?: () => void;
}

export function TagBadge({ name, color, count, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold border-[2px] border-border neo-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
      style={{ backgroundColor: color + "40" }}
    >
      #{name}
      {count !== undefined && (
        <span className="text-muted-foreground">({count})</span>
      )}
    </button>
  );
}
