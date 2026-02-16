import { useEffect, useCallback, useRef } from "react";
import { useAppState, useAppDispatch } from "../store/AppContext";
import type { SearchResult } from "../store/types";

export function useSearch() {
  const { searchQuery, searchResults } = useAppState();
  const dispatch = useAppDispatch();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const setQuery = useCallback(
    (query: string) => {
      dispatch({ type: "SET_SEARCH_QUERY", query });
    },
    [dispatch],
  );

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (!searchQuery.trim()) {
      dispatch({ type: "SET_SEARCH_RESULTS", results: [] });
      return;
    }
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const results: SearchResult[] = await res.json();
        dispatch({ type: "SET_SEARCH_RESULTS", results });
      } catch {
        dispatch({ type: "SET_SEARCH_RESULTS", results: [] });
      }
    }, 300);

    return () => clearTimeout(timerRef.current);
  }, [searchQuery, dispatch]);

  return { searchQuery, searchResults, setQuery };
}
