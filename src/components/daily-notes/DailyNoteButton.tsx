import React, { useEffect, useCallback } from "react";
import { Calendar } from "lucide-react";
import { useNotes } from "@/hooks/useNotes";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function DailyNoteButton() {
  const { openNote } = useNotes();

  const createDailyNote = useCallback(async () => {
    const res = await fetch("/api/daily-notes", { method: "POST" });
    const note = await res.json();
    openNote(note.id);
  }, [openNote]);

  useEffect(() => {
    function handler() {
      createDailyNote();
    }
    window.addEventListener("daily-note", handler);
    return () => window.removeEventListener("daily-note", handler);
  }, [createDailyNote]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={createDailyNote}
          className="p-1.5 hover:bg-neo-orange/40 transition-colors"
        >
          <Calendar size={14} />
        </button>
      </TooltipTrigger>
      <TooltipContent className="neo-border neo-shadow-sm">
        Daily Note (Ctrl+D)
      </TooltipContent>
    </Tooltip>
  );
}
