import { getDB } from "../db/database";

export const tagsRoutes = {
  "/api/tags": {
    GET: () => {
      const db = getDB();
      const tags = db.query(`
        SELECT t.*, COUNT(nt.note_id) as count
        FROM tags t
        LEFT JOIN note_tags nt ON t.id = nt.tag_id
        LEFT JOIN notes n ON nt.note_id = n.id AND n.is_deleted = 0
        GROUP BY t.id
        ORDER BY count DESC
      `).all();
      return Response.json(tags);
    },
  },
  "/api/tags/:id": {
    PUT: async (req: Request & { params: { id: string } }) => {
      const db = getDB();
      const { name, color } = await req.json();
      db.run("UPDATE tags SET name = COALESCE(?, name), color = COALESCE(?, color) WHERE id = ?", [name, color, req.params.id]);
      const tag = db.query("SELECT * FROM tags WHERE id = ?").get(req.params.id);
      return Response.json(tag);
    },
    DELETE: (req: Request & { params: { id: string } }) => {
      const db = getDB();
      db.run("DELETE FROM tags WHERE id = ?", [req.params.id]);
      return new Response(null, { status: 204 });
    },
  },
  "/api/notes/:id/tags": {
    GET: (req: Request & { params: { id: string } }) => {
      const db = getDB();
      const tags = db.query(`
        SELECT t.* FROM tags t
        JOIN note_tags nt ON t.id = nt.tag_id
        WHERE nt.note_id = ?
      `).all(req.params.id);
      return Response.json(tags);
    },
  },
};
