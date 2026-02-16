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
      if (!ctrl) return;

      const key = e.key.toLowerCase();

      switch (key) {
        case "p":
          e.preventDefault();
          dispatch({ type: "SET_COMMAND_PALETTE_OPEN", open: true });
          break;
        case "n":
          if (!e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent("create-note"));
          }
          break;
        case "s":
          e.preventDefault();
          forceSave();
          break;
        case "f":
          if (e.shiftKey) {
            e.preventDefault();
            document.querySelector<HTMLInputElement>("[data-search-input]")?.focus();
          }
          break;
        case "\\":
          e.preventDefault();
          dispatch({ type: e.shiftKey ? "TOGGLE_RIGHT_SIDEBAR" : "TOGGLE_LEFT_SIDEBAR" });
          break;
        case "|":
          e.preventDefault();
          dispatch({ type: "TOGGLE_RIGHT_SIDEBAR" });
          break;
        case "w":
          e.preventDefault();
          if (activeNoteId) closeTab(activeNoteId);
          break;
        case "tab":
          e.preventDefault();
          if (e.shiftKey) prevTab();
          else nextTab();
          break;
        case "g":
          e.preventDefault();
          dispatch({ type: "SET_SHOW_GRAPH", show: true });
          break;
        case "d":
          e.preventDefault();
          window.dispatchEvent(new CustomEvent("daily-note"));
          break;
      }
    }

    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [dispatch, forceSave, closeTab, nextTab, prevTab, activeNoteId]);
}
