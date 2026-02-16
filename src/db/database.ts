import { Database } from "bun:sqlite";
import { initSchema } from "./schema";

const DB_KEY = "__better_obsidian_db__";

declare var globalThis: { [DB_KEY]?: Database };

export function getDB(): Database {
  if (!globalThis[DB_KEY]) {
    const db = new Database("data/obsidian.db", { create: true });
    initSchema(db);
    globalThis[DB_KEY] = db;
  }
  return globalThis[DB_KEY]!;
}
