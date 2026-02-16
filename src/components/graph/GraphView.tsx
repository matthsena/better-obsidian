import React, { useEffect, useRef, useCallback } from "react";
import { useGraph } from "@/hooks/useGraph";
import { useNotes } from "@/hooks/useNotes";
import { GraphControls } from "./GraphControls";
import * as d3 from "d3";

const COLORS = ["#FFD700", "#FF6B9D", "#4ECDC4", "#A8E6CF", "#9B59B6", "#FF9F43"];

export function GraphView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { graphData, fetchGraph, setShowGraph } = useGraph();
  const { openNote } = useNotes();
  const transformRef = useRef(d3.zoomIdentity);
  const simRef = useRef<d3.Simulation<any, any>>();

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !graphData) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

    const t = transformRef.current;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.scale(t.k, t.k);

    // Draw edges
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 2;
    for (const edge of graphData.edges) {
      const source = (graphData.nodes as any[]).find((n) => n.id === (typeof edge.source === "object" ? (edge.source as any).id : edge.source));
      const target = (graphData.nodes as any[]).find((n) => n.id === (typeof edge.target === "object" ? (edge.target as any).id : edge.target));
      if (source?.x != null && target?.x != null) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }
    }

    // Draw nodes
    const groups = [...new Set(graphData.nodes.map((n) => n.group))];
    for (const node of graphData.nodes as any[]) {
      if (node.x == null) continue;
      const colorIdx = groups.indexOf(node.group) % COLORS.length;
      const color = COLORS[colorIdx];

      ctx.fillStyle = color;
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#000";
      ctx.font = "bold 10px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.title, node.x, node.y + 20);
    }

    ctx.restore();
  }, [graphData]);

  useEffect(() => {
    if (!graphData || graphData.nodes.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = canvas.getBoundingClientRect();

    const nodes = graphData.nodes.map((n) => ({ ...n })) as any[];
    const edges = graphData.edges.map((e) => ({ ...e }));

    const sim = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(edges).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", () => {
        // Update graphData nodes in place for drawing
        for (let i = 0; i < nodes.length; i++) {
          (graphData.nodes as any[])[i].x = nodes[i].x;
          (graphData.nodes as any[])[i].y = nodes[i].y;
        }
        draw();
      });

    simRef.current = sim;

    // Zoom
    const zoomBehavior = d3.zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.1, 5])
      .on("zoom", (event) => {
        transformRef.current = event.transform;
        draw();
      });

    d3.select(canvas).call(zoomBehavior);

    // Click to open note
    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const t = transformRef.current;
      const x = (e.clientX - rect.left - t.x) / t.k;
      const y = (e.clientY - rect.top - t.y) / t.k;

      for (const node of graphData.nodes as any[]) {
        if (node.x == null) continue;
        const dx = node.x - x;
        const dy = node.y - y;
        if (dx * dx + dy * dy < 144) {
          openNote(node.id);
          setShowGraph(false);
          return;
        }
      }
    };

    return () => {
      sim.stop();
    };
  }, [graphData, draw, openNote, setShowGraph]);

  return (
    <div className="relative w-full h-full bg-background">
      <GraphControls
        onZoomIn={() => {
          transformRef.current = transformRef.current.scale(1.3);
          draw();
        }}
        onZoomOut={() => {
          transformRef.current = transformRef.current.scale(0.7);
          draw();
        }}
        onFit={() => {
          transformRef.current = d3.zoomIdentity;
          draw();
        }}
        onClose={() => setShowGraph(false)}
      />
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
