import { useEffect, useRef } from "react";
import { useAppDispatch } from "../store/AppContext";
import { useAutoSave } from "./useAutoSave";
import { useTabs } from "./useTabs";

export function useKeyboard() {
  const dispatch = useAppDispatch();
  const { forceSave } = useAutoSave();
  const { closeTab, nextTab, prevTab, activeNoteId } = useTabs();

  // Store latest values in refs so the handler never needs to be re-registered
  const ref = useRef({ dispatch, forceSave, closeTab, nextTab, prevTab, activeNoteId });
  ref.current = { dispatch, forceSave, closeTab, nextTab, prevTab, activeNoteId };

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const ctrl = e.ctrlKey || e.metaKey;
      if (!ctrl) return;

      const { dispatch, forceSave, closeTab, nextTab, prevTab, activeNoteId } = ref.current;

      switch (e.code) {
        case "KeyP":
          e.preventDefault();
          dispatch({ type: "SET_COMMAND_PALETTE_OPEN", open: true });
          break;
        case "KeyN":
          if (!e.shiftKey) {
            e.preventDefault();
            e.stopImmediatePropagation();
            window.dispatchEvent(new CustomEvent("create-note"));
          }
          break;
        case "KeyS":
          e.preventDefault();
          forceSave();
          break;
        case "KeyF":
          if (e.shiftKey) {
            e.preventDefault();
            document.querySelector<HTMLInputElement>("[data-search-input]")?.focus();
          }
          break;
        case "Backslash":
          e.preventDefault();
          dispatch({ type: e.shiftKey ? "TOGGLE_RIGHT_SIDEBAR" : "TOGGLE_LEFT_SIDEBAR" });
          break;
        case "KeyW":
          e.preventDefault();
          if (activeNoteId) closeTab(activeNoteId);
          break;
        case "Tab":
          e.preventDefault();
          if (e.shiftKey) prevTab();
          else nextTab();
          break;
        case "KeyG":
          e.preventDefault();
          dispatch({ type: "SET_SHOW_GRAPH", show: true });
          break;
        case "KeyD":
          e.preventDefault();
          window.dispatchEvent(new CustomEvent("daily-note"));
          break;
      }
    }

    // Register once, never re-register — capture phase to beat browser defaults
    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, []); // empty deps — handler uses refs
}
