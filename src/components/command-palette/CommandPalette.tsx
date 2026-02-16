import React, { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { useNotes } from "@/hooks/useNotes";
import { useGraph } from "@/hooks/useGraph";
import { FileText, Search, BarChart3, Calendar, Settings } from "lucide-react";

export function CommandPalette() {
  const { isOpen, close } = useCommandPalette();
  const { notes, openNote } = useNotes();
  const { setShowGraph } = useGraph();

  return (
    <CommandDialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <CommandInput placeholder="Search notes or type a command..." className="font-bold" />
      <CommandList>
        <CommandEmpty className="py-6 text-center text-sm font-bold text-muted-foreground">
          No results found.
        </CommandEmpty>
        <CommandGroup heading="Notes" className="font-black text-xs uppercase">
          {notes.slice(0, 10).map((note) => (
            <CommandItem
              key={note.id}
              value={note.title}
              onSelect={() => {
                openNote(note.id);
                close();
              }}
              className="font-bold"
            >
              <FileText size={14} className="mr-2" />
              {note.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Commands" className="font-black text-xs uppercase">
          <CommandItem
            onSelect={() => {
              window.dispatchEvent(new CustomEvent("create-note"));
              close();
            }}
            className="font-bold"
          >
            <FileText size={14} className="mr-2" />
            New Note
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setShowGraph(true);
              close();
            }}
            className="font-bold"
          >
            <BarChart3 size={14} className="mr-2" />
            Open Graph View
          </CommandItem>
          <CommandItem
            onSelect={() => {
              window.dispatchEvent(new CustomEvent("daily-note"));
              close();
            }}
            className="font-bold"
          >
            <Calendar size={14} className="mr-2" />
            Daily Note
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
