import { getDB } from "../db/database";

export const settingsRoutes = {
  "/api/settings": {
    GET: () => {
      const db = getDB();
      const rows = db.query("SELECT key, value FROM settings").all() as { key: string; value: string }[];
      const settings: Record<string, string> = {};
      for (const row of rows) settings[row.key] = row.value;
      return Response.json(settings);
    },
    PUT: async (req: Request) => {
      const db = getDB();
      const body = await req.json();
      const upsert = db.prepare(
        "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      );
      for (const [key, value] of Object.entries(body)) {
        upsert.run(key, String(value));
      }
      return Response.json({ ok: true });
    },
  },
};
