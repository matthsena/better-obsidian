import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, Trash2, Pencil } from "lucide-react";
import { useNotes } from "@/hooks/useNotes";
import { useFolders } from "@/hooks/useFolders";
import { useAppState } from "@/store/AppContext";
import { cn } from "@/lib/utils";
import type { Folder as FolderType, Note } from "@/store/types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface FolderItemProps {
  folder: FolderType;
  depth: number;
  onCreateNote: (folderId: number) => void;
  onCreateFolder: (parentId: number) => void;
}

export function FolderItem({ folder, depth, onCreateNote, onCreateFolder }: FolderItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { deleteFolder } = useFolders();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetch(`/api/folders/${folder.id}/notes`)
      .then((r) => r.json())
      .then(setNotes)
      .catch(() => {});
  }, [folder.id]);

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center gap-1 w-full px-2 py-1 text-sm font-bold hover:bg-primary/20 transition-colors",
            )}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
          >
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            {isOpen ? <FolderOpen size={14} /> : <Folder size={14} />}
            <span className="truncate">{folder.name}</span>
          </button>
        </ContextMenuTrigger>
        <ContextMenuContent className="neo-border neo-shadow">
          <ContextMenuItem
            onClick={() => onCreateNote(folder.id)}
            className="font-bold text-sm"
          >
            <FileText size={14} className="mr-2" /> New Note
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => onCreateFolder(folder.id)}
            className="font-bold text-sm"
          >
            <Folder size={14} className="mr-2" /> New Subfolder
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => deleteFolder(folder.id)}
            className="font-bold text-sm text-destructive"
          >
            <Trash2 size={14} className="mr-2" /> Delete Folder
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      {isOpen && (
        <div>
          {notes.map((note) => (
            <NoteItem key={note.id} note={note} depth={depth + 1} />
          ))}
          {folder.children?.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              depth={depth + 1}
              onCreateNote={onCreateNote}
              onCreateFolder={onCreateFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface NoteItemProps {
  note: Note;
  depth: number;
}

export function NoteItem({ note, depth }: NoteItemProps) {
  const { activeNoteId } = useAppState();
  const { openNote, deleteNote } = useNotes();
  const isActive = activeNoteId === note.id;

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <button
          onClick={() => openNote(note.id)}
          className={cn(
            "flex items-center gap-1.5 w-full px-2 py-1 text-sm font-bold hover:bg-primary/20 transition-colors",
            isActive && "bg-primary/40",
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          <FileText size={14} className="shrink-0" />
          <span className="truncate">{note.title}</span>
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent className="neo-border neo-shadow">
        <ContextMenuItem
          onClick={() => deleteNote(note.id)}
          className="font-bold text-sm text-destructive"
        >
          <Trash2 size={14} className="mr-2" /> Delete Note
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
