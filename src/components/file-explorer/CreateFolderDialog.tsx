import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFolders } from "@/hooks/useFolders";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId?: number | null;
}

export function CreateFolderDialog({ open, onOpenChange, parentId }: Props) {
  const [name, setName] = useState("");
  const { createFolder } = useFolders();

  useEffect(() => {
    if (open) setName("");
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await createFolder(name.trim(), parentId);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neo-border neo-shadow-lg bg-background">
        <DialogHeader>
          <DialogTitle className="text-lg font-black">New Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Folder name..."
            className="w-full px-3 py-2 text-sm font-bold neo-input"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 text-sm bg-neo-cyan neo-btn"
          >
            Create Folder
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
