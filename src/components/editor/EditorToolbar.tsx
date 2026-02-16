import React from "react";
import { Bold, Italic, Heading1, Heading2, Code, Link, List, ListOrdered, Quote, Minus, Eye, Edit3 } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  isPreview: boolean;
  onTogglePreview: () => void;
}

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className="p-1.5 hover:bg-primary/40 transition-colors"
        >
          <Icon size={16} />
        </button>
      </TooltipTrigger>
      <TooltipContent className="neo-border neo-shadow-sm">{label}</TooltipContent>
    </Tooltip>
  );
}

export function EditorToolbar({ isPreview, onTogglePreview }: Props) {
  return (
    <div className="flex items-center gap-0.5 px-2 py-1 border-b-[3px] border-border bg-muted">
      <ToolbarButton icon={Bold} label="Bold" />
      <ToolbarButton icon={Italic} label="Italic" />
      <Separator orientation="vertical" className="h-5 mx-1 border-l-[2px] border-border" />
      <ToolbarButton icon={Heading1} label="Heading 1" />
      <ToolbarButton icon={Heading2} label="Heading 2" />
      <Separator orientation="vertical" className="h-5 mx-1 border-l-[2px] border-border" />
      <ToolbarButton icon={Code} label="Code" />
      <ToolbarButton icon={Link} label="Link" />
      <ToolbarButton icon={Quote} label="Blockquote" />
      <Separator orientation="vertical" className="h-5 mx-1 border-l-[2px] border-border" />
      <ToolbarButton icon={List} label="Bullet List" />
      <ToolbarButton icon={ListOrdered} label="Numbered List" />
      <ToolbarButton icon={Minus} label="Horizontal Rule" />
      <div className="flex-1" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={isPreview}
            onPressedChange={onTogglePreview}
            className="neo-border neo-shadow-sm data-[state=on]:bg-primary h-7 px-2"
          >
            {isPreview ? <Eye size={14} /> : <Edit3 size={14} />}
            <span className="ml-1 text-xs font-bold">
              {isPreview ? "Preview" : "Edit"}
            </span>
          </Toggle>
        </TooltipTrigger>
        <TooltipContent className="neo-border neo-shadow-sm">Toggle Preview</TooltipContent>
      </Tooltip>
    </div>
  );
}
