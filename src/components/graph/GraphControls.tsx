import React from "react";
import { ZoomIn, ZoomOut, Maximize2, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onClose: () => void;
}

export function GraphControls({ onZoomIn, onZoomOut, onFit, onClose }: Props) {
  return (
    <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={onZoomIn} className="p-1.5 bg-background neo-border neo-shadow-sm hover:bg-primary/30">
            <ZoomIn size={14} />
          </button>
        </TooltipTrigger>
        <TooltipContent className="neo-border neo-shadow-sm">Zoom In</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={onZoomOut} className="p-1.5 bg-background neo-border neo-shadow-sm hover:bg-primary/30">
            <ZoomOut size={14} />
          </button>
        </TooltipTrigger>
        <TooltipContent className="neo-border neo-shadow-sm">Zoom Out</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={onFit} className="p-1.5 bg-background neo-border neo-shadow-sm hover:bg-primary/30">
            <Maximize2 size={14} />
          </button>
        </TooltipTrigger>
        <TooltipContent className="neo-border neo-shadow-sm">Fit to View</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={onClose} className="p-1.5 bg-background neo-border neo-shadow-sm hover:bg-neo-pink/30">
            <X size={14} />
          </button>
        </TooltipTrigger>
        <TooltipContent className="neo-border neo-shadow-sm">Close Graph</TooltipContent>
      </Tooltip>
    </div>
  );
}
