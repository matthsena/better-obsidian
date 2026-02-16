import React from "react";
import { useAppState } from "@/store/AppContext";

export function StatusBar() {
  const { activeNoteId, activeContent, tabs } = useAppState();
  const activeTab = tabs.find((t) => t.noteId === activeNoteId);

  const wordCount = activeContent
    ? activeContent.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const charCount = activeContent.length;
  const lineCount = activeContent ? activeContent.split("\n").length : 0;

  return (
    <div className="flex items-center justify-between px-3 py-1 border-t-[3px] border-border bg-muted text-xs font-bold">
      <div className="flex items-center gap-4">
        {activeNoteId ? (
          <>
            <span>{wordCount} words</span>
            <span>{charCount} chars</span>
            <span>{lineCount} lines</span>
          </>
        ) : (
          <span className="text-muted-foreground">No note selected</span>
        )}
      </div>
      <div className="flex items-center gap-4">
        {activeTab?.isDirty && (
          <span className="text-neo-pink">Unsaved changes</span>
        )}
        {activeTab && !activeTab.isDirty && activeNoteId && (
          <span className="text-neo-cyan">Saved</span>
        )}
        <span className="text-muted-foreground">Better Obsidian</span>
      </div>
    </div>
  );
}
