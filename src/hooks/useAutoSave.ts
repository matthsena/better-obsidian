import { useEffect, useRef, useCallback } from "react";
import { useAppState, useAppDispatch } from "../store/AppContext";

export function useAutoSave(saveDelay = 1000) {
  const { activeNoteId, activeContent, tabs } = useAppState();
  const dispatch = useAppDispatch();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const lastSavedRef = useRef<string>("");

  const save = useCallback(
    async (noteId: number, content: string) => {
      try {
        const res = await fetch(`/api/notes/${noteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        const note = await res.json();
        dispatch({ type: "UPDATE_NOTE", note });
        dispatch({ type: "SET_TAB_DIRTY", noteId, isDirty: false });
        if (note.title) {
          dispatch({ type: "UPDATE_TAB_TITLE", noteId, title: note.title });
        }
        lastSavedRef.current = content;
      } catch (err) {
        console.error("Auto-save failed:", err);
      }
    },
    [dispatch],
  );

  const forceSave = useCallback(() => {
    if (activeNoteId && activeContent !== lastSavedRef.current) {
      clearTimeout(timerRef.current);
      save(activeNoteId, activeContent);
    }
  }, [activeNoteId, activeContent, save]);

  useEffect(() => {
    if (!activeNoteId) return;
    if (activeContent === lastSavedRef.current) return;

    dispatch({ type: "SET_TAB_DIRTY", noteId: activeNoteId, isDirty: true });

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      save(activeNoteId, activeContent);
    }, saveDelay);

    return () => clearTimeout(timerRef.current);
  }, [activeContent, activeNoteId, saveDelay, save, dispatch]);

  // Reset last saved when switching notes
  useEffect(() => {
    lastSavedRef.current = activeContent;
  }, [activeNoteId]);

  return { forceSave };
}
