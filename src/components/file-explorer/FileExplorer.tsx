import React, { useEffect, useState } from "react";
import { FilePlus, FolderPlus } from "lucide-react";
import { useNotes } from "@/hooks/useNotes";
import { useFolders } from "@/hooks/useFolders";
import { useAppState } from "@/store/AppContext";
import { FolderItem, NoteItem } from "./FileTreeItem";
import { CreateNoteDialog } from "./CreateNoteDialog";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function FileExplorer() {
  const { notes, fetchNotes } = useNotes();
  const { folders, fetchFolders } = useFolders();
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [targetFolderId, setTargetFolderId] = useState<number | null>(null);
  const [targetParentId, setTargetParentId] = useState<number | null>(null);

  useEffect(() => {
    fetchNotes();
    fetchFolders();
  }, [fetchNotes, fetchFolders]);

  // Listen for create-note event (from command palette / buttons)
  useEffect(() => {
    function handler() {
      setTargetFolderId(null);
      setNoteDialogOpen(true);
    }
    window.addEventListener("create-note", handler);
    return () => window.removeEventListener("create-note", handler);
  }, []);

  // Root-level notes (no folder)
  const rootNotes = notes.filter((n) => !n.folder_id);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b-[3px] border-border">
        <span className="text-xs font-black uppercase tracking-wider">
          Files
        </span>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  setTargetFolderId(null);
                  setNoteDialogOpen(true);
                }}
                className="p-1 hover:bg-primary/40 transition-colors"
              >
                <FilePlus size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="neo-border neo-shadow-sm">New Note</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  setTargetParentId(null);
                  setFolderDialogOpen(true);
                }}
                className="p-1 hover:bg-neo-cyan/40 transition-colors"
              >
                <FolderPlus size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="neo-border neo-shadow-sm">New Folder</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="py-1">
          {folders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              depth={0}
              onCreateNote={(folderId) => {
                setTargetFolderId(folderId);
                setNoteDialogOpen(true);
              }}
              onCreateFolder={(parentId) => {
                setTargetParentId(parentId);
                setFolderDialogOpen(true);
              }}
            />
          ))}
          {rootNotes.map((note) => (
            <NoteItem key={note.id} note={note} depth={0} />
          ))}
        </div>
      </ScrollArea>
      <CreateNoteDialog
        open={noteDialogOpen}
        onOpenChange={(open) => {
          setNoteDialogOpen(open);
          if (!open) fetchNotes();
        }}
        folderId={targetFolderId}
      />
      <CreateFolderDialog
        open={folderDialogOpen}
        onOpenChange={(open) => {
          setFolderDialogOpen(open);
          if (!open) fetchFolders();
        }}
        parentId={targetParentId}
      />
    </div>
  );
}
