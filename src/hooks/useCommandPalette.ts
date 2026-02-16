import { useCallback } from "react";
import { useAppState, useAppDispatch } from "../store/AppContext";

export function useCommandPalette() {
  const { commandPaletteOpen } = useAppState();
  const dispatch = useAppDispatch();

  const open = useCallback(() => {
    dispatch({ type: "SET_COMMAND_PALETTE_OPEN", open: true });
  }, [dispatch]);

  const close = useCallback(() => {
    dispatch({ type: "SET_COMMAND_PALETTE_OPEN", open: false });
  }, [dispatch]);

  const toggle = useCallback(() => {
    dispatch({ type: "SET_COMMAND_PALETTE_OPEN", open: !commandPaletteOpen });
  }, [dispatch, commandPaletteOpen]);

  return { isOpen: commandPaletteOpen, open, close, toggle };
}
