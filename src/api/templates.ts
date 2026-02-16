import { getDB } from "../db/database";

export const templatesRoutes = {
  "/api/templates": {
    GET: () => {
      const db = getDB();
      const templates = db.query("SELECT * FROM templates ORDER BY name ASC").all();
      return Response.json(templates);
    },
    POST: async (req: Request) => {
      const db = getDB();
      const { name, content = "" } = await req.json();
      const result = db.run("INSERT INTO templates (name, content) VALUES (?, ?)", [name, content]);
      const template = db.query("SELECT * FROM templates WHERE id = ?").get(Number(result.lastInsertRowid));
      return Response.json(template, { status: 201 });
    },
  },
  "/api/templates/:id": {
    PUT: async (req: Request & { params: { id: string } }) => {
      const db = getDB();
      const { name, content } = await req.json();
      db.run(
        "UPDATE templates SET name = COALESCE(?, name), content = COALESCE(?, content), updated_at = datetime('now') WHERE id = ?",
        [name, content, req.params.id],
      );
      const template = db.query("SELECT * FROM templates WHERE id = ?").get(req.params.id);
      return Response.json(template);
    },
    DELETE: (req: Request & { params: { id: string } }) => {
      const db = getDB();
      db.run("DELETE FROM templates WHERE id = ?", [req.params.id]);
      return new Response(null, { status: 204 });
    },
  },
};
