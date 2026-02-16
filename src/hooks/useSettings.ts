import { useCallback, useEffect } from "react";
import { useAppState, useAppDispatch } from "../store/AppContext";
import type { Settings } from "../store/types";

const CSS_VAR_MAP: Record<string, string[]> = {
  backgroundColor: ["--background", "--card", "--popover", "--sidebar"],
  primaryColor: ["--primary", "--sidebar-primary", "--chart-1"],
};

function applyCSSSettings(settings: Settings) {
  const root = document.documentElement;
  for (const [key, vars] of Object.entries(CSS_VAR_MAP)) {
    const value = settings[key];
    if (value) {
      for (const v of vars) root.style.setProperty(v, value);
    }
  }
}

export function useSettings() {
  const { settings } = useAppState();
  const dispatch = useAppDispatch();

  const fetchSettings = useCallback(async () => {
    const res = await fetch("/api/settings");
    const data: Settings = await res.json();
    dispatch({ type: "SET_SETTINGS", settings: data });
    applyCSSSettings(data);
  }, [dispatch]);

  const updateSettings = useCallback(
    async (data: Settings) => {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const merged = { ...settings, ...data };
      dispatch({ type: "SET_SETTINGS", settings: merged });
      applyCSSSettings(merged);
    },
    [dispatch, settings],
  );

  // Apply on mount
  useEffect(() => {
    if (Object.keys(settings).length > 0) {
      applyCSSSettings(settings);
    }
  }, [settings]);

  return { settings, fetchSettings, updateSettings };
}
