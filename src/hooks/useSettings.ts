import { useCallback, useEffect } from "react";
import { useAppState, useAppDispatch } from "../store/AppContext";
import type { Settings } from "../store/types";

const DARK_DEFAULTS = {
  backgroundColor: "#1a1a1a",
  inputBackgroundColor: "#2a2a2a",
  fontColor: "#e0e0e0",
  primaryColor: "#FFD700",
};

const LIGHT_DEFAULTS = {
  backgroundColor: "#FFFEF5",
  inputBackgroundColor: "#FFFFFF",
  fontColor: "#000000",
  primaryColor: "#FFD700",
};

export function getThemeDefaults(mode: string) {
  return mode === "dark" ? DARK_DEFAULTS : LIGHT_DEFAULTS;
}

function applyCSSSettings(settings: Settings) {
  const root = document.documentElement;
  const isDark = settings.themeMode === "dark";
  const defaults = isDark ? DARK_DEFAULTS : LIGHT_DEFAULTS;

  const bg = settings.backgroundColor || defaults.backgroundColor;
  const primary = settings.primaryColor || defaults.primaryColor;
  const inputBg = settings.inputBackgroundColor || defaults.inputBackgroundColor;
  const font = settings.fontColor || defaults.fontColor;

  // Border/shadow color — derived from font color for contrast
  const borderColor = isDark ? "#e0e0e0" : "oklch(0.145 0 0)";
  const mutedFg = isDark ? "#a0a0a0" : "oklch(0.4 0 0)";

  // Background-related vars
  for (const v of ["--background", "--card", "--popover", "--sidebar"]) {
    root.style.setProperty(v, bg);
  }

  // Primary-related vars
  for (const v of ["--primary", "--sidebar-primary", "--chart-1"]) {
    root.style.setProperty(v, primary);
  }

  // Input background — independent from page background
  root.style.setProperty("--input-bg", inputBg);

  // Font color
  for (const v of [
    "--foreground",
    "--card-foreground",
    "--popover-foreground",
    "--sidebar-foreground",
  ]) {
    root.style.setProperty(v, font);
  }

  // Border & structural colors
  for (const v of ["--border", "--input", "--ring", "--sidebar-border", "--sidebar-ring"]) {
    root.style.setProperty(v, borderColor);
  }
  root.style.setProperty("--muted-foreground", mutedFg);

  // Neo shadows & borders — adapt to theme
  root.style.setProperty("--neo-shadow-sm", `2px 2px 0px ${borderColor}`);
  root.style.setProperty("--neo-shadow", `4px 4px 0px ${borderColor}`);
  root.style.setProperty("--neo-shadow-lg", `6px 6px 0px ${borderColor}`);
  root.style.setProperty("--neo-border", `3px solid ${borderColor}`);

  // Font family
  const fontFamily = settings.fontFamily || "Inter, system-ui, sans-serif";
  root.style.setProperty("font-family", fontFamily);

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
