import React from "react";
import { Search } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { useNotes } from "@/hooks/useNotes";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SearchPanel() {
  const { searchQuery, searchResults, setQuery } = useSearch();
  const { openNote } = useNotes();

  return (
    <div className="flex flex-col">
      <div className="relative px-2 pb-2">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          data-search-input
          value={searchQuery}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes..."
          className="w-full pl-8 pr-3 py-1.5 text-sm font-bold neo-input"
        />
      </div>
      {searchResults.length > 0 && (
        <ScrollArea className="max-h-[200px]">
          <div className="px-2 space-y-1">
            {searchResults.map((result) => (
              <button
                key={result.id}
                onClick={() => openNote(result.id)}
                className="w-full text-left p-2 hover:bg-primary/30 transition-colors border-[2px] border-border"
              >
                <div className="font-bold text-sm truncate">{result.title}</div>
                <div
                  className="text-xs text-muted-foreground truncate mt-0.5"
                  dangerouslySetInnerHTML={{ __html: result.snippet }}
                />
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
