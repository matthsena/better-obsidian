import React, { useEffect, useState } from "react";
import type { Template } from "@/store/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (content: string) => void;
}

export function TemplateSelector({ open, onOpenChange, onSelect }: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    if (open) {
      fetch("/api/templates")
        .then((r) => r.json())
        .then(setTemplates)
        .catch(() => {});
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neo-border neo-shadow-lg bg-background">
        <DialogHeader>
          <DialogTitle className="text-lg font-black">
            Choose Template
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-[300px] overflow-auto">
          {templates.length === 0 && (
            <p className="text-sm text-muted-foreground font-bold py-4 text-center">
              No templates yet
            </p>
          )}
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                onSelect(t.content);
                onOpenChange(false);
              }}
              className="w-full text-left p-3 neo-border neo-shadow-sm hover:bg-primary/20 transition-colors"
            >
              <div className="font-bold text-sm">{t.name}</div>
              <div className="text-xs text-muted-foreground truncate mt-1">
                {t.content.slice(0, 100)}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
