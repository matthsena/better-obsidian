import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNotes } from "@/hooks/useNotes";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId?: number | null;
}

export function CreateNoteDialog({ open, onOpenChange, folderId }: Props) {
  const [title, setTitle] = useState("");
  const { createNote, openNote } = useNotes();

  useEffect(() => {
    if (open) setTitle("");
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const note = await createNote(title.trim(), folderId);
    await openNote(note.id);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neo-border neo-shadow-lg bg-background">
        <DialogHeader>
          <DialogTitle className="text-lg font-black">New Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full px-3 py-2 text-sm font-bold neo-input"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 text-sm bg-primary neo-btn"
          >
            Create Note
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
