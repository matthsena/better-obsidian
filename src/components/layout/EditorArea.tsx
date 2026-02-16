import React, { useState, useCallback } from "react";
import { useAppState, useAppDispatch } from "@/store/AppContext";
import { EditorTabs } from "@/components/editor/EditorTabs";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { MarkdownPreview } from "@/components/editor/MarkdownPreview";
import { GraphView } from "@/components/graph/GraphView";
import { useNotes } from "@/hooks/useNotes";
import { FileText, PenLine } from "lucide-react";

export function EditorArea() {
  const { activeNoteId, activeContent, showGraph } = useAppState();
  const dispatch = useAppDispatch();
  const { openNote, notes } = useNotes();
  const [isPreview, setIsPreview] = useState(false);

  const handleContentChange = useCallback(
    (content: string) => {
      dispatch({ type: "SET_ACTIVE_CONTENT", content });
    },
    [dispatch],
  );

  const handleWikiLinkClick = useCallback(
    (title: string) => {
      const note = notes.find((n) => n.title === title);
      if (note) openNote(note.id);
    },
    [notes, openNote],
  );

  if (showGraph) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-3 py-2 border-b-[3px] border-border bg-muted flex items-center gap-2">
          <span className="text-sm font-black">Graph View</span>
        </div>
        <div className="flex-1">
          <GraphView />
        </div>
      </div>
    );
  }

  if (!activeNoteId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
        <div className="p-6 neo-border neo-shadow-lg bg-background">
          <PenLine size={48} className="mx-auto mb-4 text-primary" />
          <h2 className="text-lg font-black text-foreground text-center">
            No note selected
          </h2>
          <p className="text-sm font-bold text-center mt-1">
            Create a new note or select one from the sidebar
          </p>
          <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs font-bold items-center">
            <kbd className="px-1.5 py-0.5 neo-border bg-muted text-center">Ctrl+P</kbd>
            <span className="text-left">Command palette</span>
            <kbd className="px-1.5 py-0.5 neo-border bg-muted text-center">Ctrl+G</kbd>
            <span className="text-left">Graph view</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <EditorTabs />
      <EditorToolbar isPreview={isPreview} onTogglePreview={() => setIsPreview(!isPreview)} />
      <div className="flex-1 overflow-hidden">
        {isPreview ? (
          <MarkdownPreview
            content={activeContent}
            onWikiLinkClick={handleWikiLinkClick}
          />
        ) : (
          <MarkdownEditor
            content={activeContent}
            onChange={handleContentChange}
          />
        )}
      </div>
    </div>
  );
}
