import { useCallback, useEffect } from "react";
import { useAppState, useAppDispatch } from "../store/AppContext";
import type { Settings } from "../store/types";

function applyCSSSettings(settings: Settings) {
  const root = document.documentElement;
  const bg = settings.backgroundColor || "#FFFEF5";
  const primary = settings.primaryColor || "#FFD700";

  // Background-related vars
  for (const v of ["--background", "--card", "--popover", "--sidebar"]) {
    root.style.setProperty(v, bg);
  }

  // Primary-related vars
  for (const v of ["--primary", "--sidebar-primary", "--chart-1"]) {
    root.style.setProperty(v, primary);
  }

  // Derive muted as a subtle tint of primary over background
  root.style.setProperty(
    "--muted",
    `color-mix(in srgb, ${primary} 10%, ${bg})`,
  );

  // Derive accent as a medium tint of primary
  root.style.setProperty(
    "--accent",
    `color-mix(in srgb, ${primary} 25%, ${bg})`,
  );
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
