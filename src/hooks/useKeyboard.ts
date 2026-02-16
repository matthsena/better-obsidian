import { useEffect } from "react";
import { useAppDispatch } from "../store/AppContext";
import { useAutoSave } from "./useAutoSave";
import { useTabs } from "./useTabs";

export function useKeyboard() {
  const dispatch = useAppDispatch();
  const { forceSave } = useAutoSave();
  const { closeTab, nextTab, prevTab } = useTabs();
  const { activeNoteId } = useTabs();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const ctrl = e.ctrlKey || e.metaKey;

      // Ctrl+P — command palette
      if (ctrl && e.key === "p") {
        e.preventDefault();
        dispatch({ type: "SET_COMMAND_PALETTE_OPEN", open: true });
      }

      // Ctrl+N — new note
      if (ctrl && !e.shiftKey && e.key === "n") {
        e.preventDefault();
        // Dispatch a custom event the CreateNoteDialog will listen for
        window.dispatchEvent(new CustomEvent("create-note"));
      }

      // Ctrl+S — force save
      if (ctrl && e.key === "s") {
        e.preventDefault();
        forceSave();
      }

      // Ctrl+Shift+F — focus search
      if (ctrl && e.shiftKey && e.key === "F") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>('[data-search-input]');
        searchInput?.focus();
      }

      // Ctrl+\ — toggle left sidebar
      if (ctrl && !e.shiftKey && e.key === "\\") {
        e.preventDefault();
        dispatch({ type: "TOGGLE_LEFT_SIDEBAR" });
      }

      // Ctrl+Shift+\ — toggle right sidebar
      if (ctrl && e.shiftKey && e.key === "|") {
        e.preventDefault();
        dispatch({ type: "TOGGLE_RIGHT_SIDEBAR" });
      }

      // Ctrl+W — close tab
      if (ctrl && e.key === "w") {
        e.preventDefault();
        if (activeNoteId) closeTab(activeNoteId);
      }

      // Ctrl+Tab / Ctrl+Shift+Tab — next/prev tab
      if (ctrl && e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) prevTab();
        else nextTab();
      }

      // Ctrl+G — graph view
      if (ctrl && e.key === "g") {
        e.preventDefault();
        dispatch({ type: "SET_SHOW_GRAPH", show: true });
      }

      // Ctrl+D — daily note
      if (ctrl && e.key === "d") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("daily-note"));
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [dispatch, forceSave, closeTab, nextTab, prevTab, activeNoteId]);
}
