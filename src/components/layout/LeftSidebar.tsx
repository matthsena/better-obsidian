import React, { useState } from "react";
import { SearchPanel } from "@/components/search/SearchPanel";
import { FileExplorer } from "@/components/file-explorer/FileExplorer";
import { TagPanel } from "@/components/tags/TagPanel";
import { DailyNoteButton } from "@/components/daily-notes/DailyNoteButton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Hash, Settings } from "lucide-react";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function LeftSidebar() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-background border-r-[3px] border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b-[3px] border-border bg-primary/20">
        <span className="text-sm font-black tracking-tight">Better Obsidian</span>
        <div className="flex items-center gap-1">
          <DailyNoteButton />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setSettingsOpen(true)}
                className="p-1.5 hover:bg-neo-purple/40 transition-colors"
              >
                <Settings size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="neo-border neo-shadow-sm">Settings</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Search */}
      <div className="pt-2">
        <SearchPanel />
      </div>

      <Separator className="border-t-[3px] border-border" />

      {/* Tabs: Files / Tags */}
      <Tabs defaultValue="files" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full justify-start rounded-none border-b-[3px] border-border bg-muted h-auto p-0">
          <TabsTrigger
            value="files"
            className="rounded-none font-bold text-xs data-[state=active]:bg-background data-[state=active]:shadow-none px-3 py-1.5 border-r-[3px] border-border"
          >
            <FileText size={12} className="mr-1" /> Files
          </TabsTrigger>
          <TabsTrigger
            value="tags"
            className="rounded-none font-bold text-xs data-[state=active]:bg-background data-[state=active]:shadow-none px-3 py-1.5"
          >
            <Hash size={12} className="mr-1" /> Tags
          </TabsTrigger>
        </TabsList>
        <TabsContent value="files" className="flex-1 m-0 min-h-0 overflow-hidden">
          <FileExplorer />
        </TabsContent>
        <TabsContent value="tags" className="flex-1 m-0 min-h-0 overflow-auto">
          <TagPanel />
        </TabsContent>
      </Tabs>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
