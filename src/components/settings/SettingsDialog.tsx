import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useSettings } from "@/hooks/useSettings";
import { RotateCcw, Type } from "lucide-react";

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

const PRESET_INPUT_BG_COLORS = [
  { label: "White", value: "#FFFFFF" },
  { label: "Snow", value: "#FFFAFA" },
  { label: "Ivory", value: "#FFFFF0" },
  { label: "Light Grey", value: "#F5F5F5" },
  { label: "Linen", value: "#FAF0E6" },
  { label: "Ghost White", value: "#F8F8FF" },
];

const PRESET_FONTS = [
  { label: "Inter", value: "Inter, system-ui, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Monospace", value: "'JetBrains Mono', 'Fira Code', monospace" },
  { label: "System UI", value: "system-ui, -apple-system, sans-serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Times", value: "'Times New Roman', Times, serif" },
];

const PRESET_FONT_COLORS = [
  { label: "Black", value: "#000000" },
  { label: "Dark Grey", value: "#333333" },
  { label: "Charcoal", value: "#1A1A2E" },
  { label: "Dark Brown", value: "#3E2723" },
  { label: "Navy", value: "#1A237E" },
  { label: "Dark Slate", value: "#2F4F4F" },
];

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  presets: { label: string; value: string }[];
  inputStyle?: React.CSSProperties;
}

function ColorPicker({ value, onChange, presets, inputStyle }: ColorPickerProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 neo-border cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 text-sm font-bold neo-input uppercase"
          style={inputStyle}
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((c) => (
          <button
            key={c.value}
            onClick={() => onChange(c.value)}
            className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold border-[2px] border-border hover:neo-shadow-sm transition-all"
            style={{
              backgroundColor:
                value.toLowerCase() === c.value.toLowerCase()
                  ? c.value + "60"
                  : undefined,
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
  );
}

export function SettingsDialog({ open, onOpenChange }: Props) {
  const { settings, updateSettings } = useSettings();
  const [autoSaveDelay, setAutoSaveDelay] = useState("1000");
  const [bgColor, setBgColor] = useState("#FFFEF5");
  const [primaryColor, setPrimaryColor] = useState("#FFD700");
  const [inputBgColor, setInputBgColor] = useState("#FFFFFF");
  const [fontColor, setFontColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Inter, system-ui, sans-serif");

  useEffect(() => {
    if (open) {
      setAutoSaveDelay(settings.autoSaveDelay || "1000");
      setBgColor(settings.backgroundColor || "#FFFEF5");
      setPrimaryColor(settings.primaryColor || "#FFD700");
      setInputBgColor(settings.inputBackgroundColor || "#FFFFFF");
      setFontColor(settings.fontColor || "#000000");
      setFontFamily(settings.fontFamily || "Inter, system-ui, sans-serif");
    }
  }, [open, settings]);

  async function handleSave() {
    await updateSettings({
      autoSaveDelay,
      backgroundColor: bgColor,
      primaryColor,
      inputBackgroundColor: inputBgColor,
      fontColor,
      fontFamily,
    });
    onOpenChange(false);
  }

  async function handleReset() {
    setBgColor("#FFFEF5");
    setPrimaryColor("#FFD700");
    setInputBgColor("#FFFFFF");
    setFontColor("#000000");
    setFontFamily("Inter, system-ui, sans-serif");
    setAutoSaveDelay("1000");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="neo-border neo-shadow-lg max-w-md max-h-[85vh] overflow-y-auto"
        style={{ backgroundColor: bgColor, color: fontColor, fontFamily }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-black">Settings</DialogTitle>
          <DialogDescription className="text-sm font-bold text-muted-foreground">
            Customize your workspace
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Color Settings Accordion */}
          <Accordion type="multiple" defaultValue={[]}>
            <AccordionItem value="bg" className="border-b-[3px] border-border">
              <AccordionTrigger className="text-sm font-black py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 border-[2px] border-border shrink-0"
                    style={{ backgroundColor: bgColor }}
                  />
                  Background Color
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ColorPicker
                  value={bgColor}
                  onChange={setBgColor}
                  presets={PRESET_BG_COLORS}
                  inputStyle={{ backgroundColor: inputBgColor, color: fontColor }}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="primary" className="border-b-[3px] border-border">
              <AccordionTrigger className="text-sm font-black py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 border-[2px] border-border shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  />
                  Primary Color
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ColorPicker
                  value={primaryColor}
                  onChange={setPrimaryColor}
                  presets={PRESET_PRIMARY_COLORS}
                  inputStyle={{ backgroundColor: inputBgColor, color: fontColor }}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="inputBg" className="border-b-[3px] border-border">
              <AccordionTrigger className="text-sm font-black py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 border-[2px] border-border shrink-0"
                    style={{ backgroundColor: inputBgColor }}
                  />
                  Input Background
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ColorPicker
                  value={inputBgColor}
                  onChange={setInputBgColor}
                  presets={PRESET_INPUT_BG_COLORS}
                  inputStyle={{ backgroundColor: inputBgColor, color: fontColor }}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="font" className="border-b-[3px] border-border">
              <AccordionTrigger className="text-sm font-black py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 border-[2px] border-border shrink-0"
                    style={{ backgroundColor: fontColor }}
                  />
                  Font Color
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ColorPicker
                  value={fontColor}
                  onChange={setFontColor}
                  presets={PRESET_FONT_COLORS}
                  inputStyle={{ backgroundColor: inputBgColor, color: fontColor }}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="fontFamily" className="border-b-[3px] border-border">
              <AccordionTrigger className="text-sm font-black py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Type size={16} className="shrink-0" />
                  Font Style
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_FONTS.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => setFontFamily(f.value)}
                        className="px-3 py-1.5 text-xs font-bold border-[2px] border-border hover:neo-shadow-sm transition-all"
                        style={{
                          fontFamily: f.value,
                          backgroundColor:
                            fontFamily === f.value ? primaryColor + "60" : undefined,
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    placeholder="Custom font family..."
                    className="w-full px-3 py-2 text-sm font-bold neo-input"
                    style={{ backgroundColor: inputBgColor, color: fontColor, fontFamily }}
                  />
                  <p
                    className="text-sm p-2 border-[2px] border-border"
                    style={{ fontFamily }}
                  >
                    The quick brown fox jumps over the lazy dog.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

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
              style={{ backgroundColor: inputBgColor, color: fontColor }}
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
