import { useEffect } from "react";
import { AppProvider } from "./store/AppContext";
import { AppLayout } from "./components/layout/AppLayout";
import { CommandPalette } from "./components/command-palette/CommandPalette";
import { useKeyboard } from "./hooks/useKeyboard";
import { useAutoSave } from "./hooks/useAutoSave";
import { useSettings } from "./hooks/useSettings";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./index.css";

function AppInner() {
  useKeyboard();
  useAutoSave();
  const { fetchSettings } = useSettings();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <>
      <AppLayout />
      <CommandPalette />
    </>
  );
}

export function App() {
  return (
    <AppProvider>
      <TooltipProvider delayDuration={200}>
        <AppInner />
      </TooltipProvider>
    </AppProvider>
  );
}

export default App;
