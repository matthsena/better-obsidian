import React from "react";
import { X, FileText } from "lucide-react";
import { useTabs } from "@/hooks/useTabs";
import { cn } from "@/lib/utils";

export function EditorTabs() {
  const { tabs, activeNoteId, switchTab, closeTab } = useTabs();

  if (tabs.length === 0) return null;

  return (
    <div className="flex border-b-[3px] border-border bg-muted overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.noteId}
          onClick={() => switchTab(tab.noteId)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 cursor-pointer border-r-[3px] border-border text-sm font-bold min-w-0 max-w-[180px] group",
            tab.noteId === activeNoteId
              ? "bg-background"
              : "bg-muted hover:bg-background/50",
          )}
        >
          <FileText size={13} className="shrink-0" />
          <span className="truncate">
            {tab.isDirty && <span className="text-neo-pink mr-0.5">*</span>}
            {tab.title}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.noteId);
            }}
            className="shrink-0 p-0.5 opacity-0 group-hover:opacity-100 hover:bg-neo-pink/30 transition-opacity"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
