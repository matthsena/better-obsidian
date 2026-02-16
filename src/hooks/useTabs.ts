import { useCallback } from "react";
import { useAppState, useAppDispatch } from "../store/AppContext";

export function useTabs() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const closeTab = useCallback(
    (noteId: number) => {
      dispatch({ type: "CLOSE_TAB", noteId });
    },
    [dispatch],
  );

  const switchTab = useCallback(
    async (noteId: number) => {
      const res = await fetch(`/api/notes/${noteId}`);
      if (!res.ok) return;
      const note = await res.json();
      dispatch({ type: "SET_ACTIVE_NOTE", id: note.id, content: note.content });
    },
    [dispatch],
  );

  const setDirty = useCallback(
    (noteId: number, isDirty: boolean) => {
      dispatch({ type: "SET_TAB_DIRTY", noteId, isDirty });
    },
    [dispatch],
  );

  const nextTab = useCallback(() => {
    if (state.tabs.length < 2) return;
    const idx = state.tabs.findIndex((t) => t.noteId === state.activeNoteId);
    const next = state.tabs[(idx + 1) % state.tabs.length];
    switchTab(next.noteId);
  }, [state.tabs, state.activeNoteId, switchTab]);

  const prevTab = useCallback(() => {
    if (state.tabs.length < 2) return;
    const idx = state.tabs.findIndex((t) => t.noteId === state.activeNoteId);
    const prev = state.tabs[(idx - 1 + state.tabs.length) % state.tabs.length];
    switchTab(prev.noteId);
  }, [state.tabs, state.activeNoteId, switchTab]);

  return {
    tabs: state.tabs,
    activeNoteId: state.activeNoteId,
    closeTab,
    switchTab,
    setDirty,
    nextTab,
    prevTab,
  };
}
