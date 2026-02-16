import React from "react";
import { useAppState } from "@/store/AppContext";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import { EditorArea } from "./EditorArea";
import { StatusBar } from "./StatusBar";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const { leftSidebarOpen, rightSidebarOpen } = useAppState();

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar */}
        {leftSidebarOpen && (
          <div className="w-[280px] shrink-0 overflow-hidden">
            <LeftSidebar />
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <EditorArea />
        </div>

        {/* Right Sidebar */}
        {rightSidebarOpen && (
          <div className="w-[260px] shrink-0 overflow-hidden">
            <RightSidebar />
          </div>
        )}
      </div>
      <StatusBar />
    </div>
  );
}
