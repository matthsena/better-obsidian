import { useCallback } from "react";
import { useAppState, useAppDispatch } from "../store/AppContext";
import type { GraphData } from "../store/types";

export function useGraph() {
  const { graphData, showGraph } = useAppState();
  const dispatch = useAppDispatch();

  const fetchGraph = useCallback(async () => {
    const res = await fetch("/api/graph");
    const data: GraphData = await res.json();
    dispatch({ type: "SET_GRAPH_DATA", data });
  }, [dispatch]);

  const setShowGraph = useCallback(
    (show: boolean) => {
      dispatch({ type: "SET_SHOW_GRAPH", show });
    },
    [dispatch],
  );

  return { graphData, showGraph, fetchGraph, setShowGraph };
}
