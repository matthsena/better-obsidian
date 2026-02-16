import React, { useEffect, useState } from "react";
import { useAppState } from "@/store/AppContext";
import { useNotes } from "@/hooks/useNotes";
import type { Backlink } from "@/store/types";
import { Link2 } from "lucide-react";

export function BacklinksPanel() {
  const { activeNoteId, tabs } = useAppState();
  const { openNote } = useNotes();
  const [backlinks, setBacklinks] = useState<Backlink[]>([]);
  const activeTab = tabs.find((t) => t.noteId === activeNoteId);

  useEffect(() => {
    if (!activeNoteId) {
      setBacklinks([]);
      return;
    }
    fetch(`/api/notes/${activeNoteId}/backlinks`)
      .then((r) => r.json())
      .then(setBacklinks)
      .catch(() => setBacklinks([]));
  }, [activeNoteId, activeTab?.isDirty]);

  if (!activeNoteId) {
    return (
      <div className="p-3 text-xs text-muted-foreground font-bold">
        Select a note to see backlinks
      </div>
    );
  }

  if (backlinks.length === 0) {
    return (
      <div className="p-3 text-xs text-muted-foreground font-bold">
        No backlinks found
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2">
      {backlinks.map((bl) => (
        <button
          key={bl.id}
          onClick={() => openNote(bl.id)}
          className="w-full text-left p-2 hover:bg-neo-purple/20 transition-colors border-[2px] border-border"
        >
          <div className="flex items-center gap-1.5">
            <Link2 size={12} />
            <span className="font-bold text-sm truncate">{bl.title}</span>
          </div>
          <div className="text-xs text-muted-foreground truncate mt-0.5">
            {bl.snippet}
          </div>
        </button>
      ))}
    </div>
  );
}
