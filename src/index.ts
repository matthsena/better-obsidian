import { serve } from "bun";
import index from "./index.html";
import { apiRoutes } from "./api/router";

// Ensure data directory exists
import { mkdirSync } from "fs";
try { mkdirSync("data", { recursive: true }); } catch {}

const server = serve({
  routes: {
    ...apiRoutes,
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Better Obsidian running at ${server.url}`);
