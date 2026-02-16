import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/hooks/useSettings";
import { RotateCcw } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRESET_BG_COLORS = [
  { label: "Warm White", value: "#FFFEF5" },
  { label: "Pure White", value: "#FFFFFF" },
  { label: "Lavender", value: "#F5F0FF" },
  { label: "Mint", value: "#F0FFF5" },
  { label: "Peach", value: "#FFF5F0" },
  { label: "Sky", value: "#F0F8FF" },
];

const PRESET_PRIMARY_COLORS = [
  { label: "Yellow", value: "#FFD700" },
  { label: "Pink", value: "#FF6B9D" },
  { label: "Cyan", value: "#4ECDC4" },
  { label: "Green", value: "#A8E6CF" },
  { label: "Purple", value: "#9B59B6" },
  { label: "Orange", value: "#FF9F43" },
];

export function SettingsDialog({ open, onOpenChange }: Props) {
  const { settings, updateSettings } = useSettings();
  const [autoSaveDelay, setAutoSaveDelay] = useState("1000");
  const [bgColor, setBgColor] = useState("#FFFEF5");
  const [primaryColor, setPrimaryColor] = useState("#FFD700");

  useEffect(() => {
    if (open) {
      setAutoSaveDelay(settings.autoSaveDelay || "1000");
      setBgColor(settings.backgroundColor || "#FFFEF5");
      setPrimaryColor(settings.primaryColor || "#FFD700");
    }
  }, [open, settings]);

  async function handleSave() {
    await updateSettings({
      autoSaveDelay,
      backgroundColor: bgColor,
      primaryColor,
    });
    onOpenChange(false);
  }

  async function handleReset() {
    setBgColor("#FFFEF5");
    setPrimaryColor("#FFD700");
    setAutoSaveDelay("1000");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neo-border neo-shadow-lg max-w-md" style={{ backgroundColor: bgColor }}>
        <DialogHeader>
          <DialogTitle className="text-lg font-black">Settings</DialogTitle>
          <DialogDescription className="text-sm font-bold text-muted-foreground">
            Customize your workspace
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Background Color */}
          <div>
            <label className="text-sm font-black block mb-2">
              Background Color
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 neo-border cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 px-3 py-2 text-sm font-bold neo-input uppercase"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_BG_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setBgColor(c.value)}
                  className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold border-[2px] border-border hover:neo-shadow-sm transition-all"
                  style={{
                    backgroundColor: bgColor === c.value ? c.value : undefined,
                  }}
                >
                  <span
                    className="w-3 h-3 border-[2px] border-border shrink-0"
                    style={{ backgroundColor: c.value }}
                  />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <Separator className="border-t-[3px] border-border" />

          {/* Primary Color */}
          <div>
            <label className="text-sm font-black block mb-2">
              Primary Color
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 neo-border cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 px-3 py-2 text-sm font-bold neo-input uppercase"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PRIMARY_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setPrimaryColor(c.value)}
                  className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold border-[2px] border-border hover:neo-shadow-sm transition-all"
                  style={{
                    backgroundColor: primaryColor === c.value ? c.value + "60" : undefined,
                  }}
                >
                  <span
                    className="w-3 h-3 border-[2px] border-border shrink-0"
                    style={{ backgroundColor: c.value }}
                  />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <Separator className="border-t-[3px] border-border" />

          {/* Auto-save Delay */}
          <div>
            <label className="text-sm font-black block mb-2">
              Auto-save delay (ms)
            </label>
            <input
              type="number"
              value={autoSaveDelay}
              onChange={(e) => setAutoSaveDelay(e.target.value)}
              min="200"
              max="10000"
              step="100"
              className="w-full px-3 py-2 text-sm font-bold neo-input"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 py-2 px-4 text-sm neo-btn bg-muted flex-1"
            >
              <RotateCcw size={14} />
              Reset Defaults
            </button>
            <button
              onClick={handleSave}
              className="py-2 px-4 text-sm neo-btn flex-1"
              style={{ backgroundColor: primaryColor }}
            >
              Save Settings
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
