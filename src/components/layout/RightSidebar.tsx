import React, { useEffect, useState } from "react";
import { useAppState } from "@/store/AppContext";
import { BacklinksPanel } from "@/components/backlinks/BacklinksPanel";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Tag } from "@/store/types";
import { TagBadge } from "@/components/tags/TagBadge";
import { Link2, Hash, Info } from "lucide-react";

export function RightSidebar() {
  const { activeNoteId, notes, tabs } = useAppState();
  const [noteTags, setNoteTags] = useState<Tag[]>([]);
  const activeNote = notes.find((n) => n.id === activeNoteId);
  const activeTab = tabs.find((t) => t.noteId === activeNoteId);

  // Re-fetch tags when note changes or when tab becomes non-dirty (i.e. saved)
  useEffect(() => {
    if (!activeNoteId) {
      setNoteTags([]);
      return;
    }
    fetch(`/api/notes/${activeNoteId}/tags`)
      .then((r) => r.json())
      .then(setNoteTags)
      .catch(() => setNoteTags([]));
  }, [activeNoteId, activeTab?.isDirty]);

  return (
    <div className="flex flex-col h-full bg-background border-l-[3px] border-border">
      <ScrollArea className="flex-1">
        {/* Properties */}
        <div className="px-3 py-2 border-b-[3px] border-border">
          <div className="flex items-center gap-1.5 mb-2">
            <Info size={12} />
            <span className="text-xs font-black uppercase tracking-wider">Properties</span>
          </div>
          {activeNote ? (
            <div className="space-y-1 text-xs font-bold">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(activeNote.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span>{new Date(activeNote.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground font-bold">No note selected</p>
          )}
        </div>

        {/* Tags */}
        <div className="px-3 py-2 border-b-[3px] border-border">
          <div className="flex items-center gap-1.5 mb-2">
            <Hash size={12} />
            <span className="text-xs font-black uppercase tracking-wider">Tags</span>
          </div>
          {noteTags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {noteTags.map((tag) => (
                <TagBadge key={tag.id} name={tag.name} color={tag.color} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground font-bold">No tags</p>
          )}
        </div>

        {/* Backlinks */}
        <div className="px-1 py-2">
          <div className="flex items-center gap-1.5 mb-1 px-2">
            <Link2 size={12} />
            <span className="text-xs font-black uppercase tracking-wider">Backlinks</span>
          </div>
          <BacklinksPanel />
        </div>
      </ScrollArea>
    </div>
  );
}
