import { getDB } from "../db/database";

function buildTree(folders: any[], parentId: number | null = null): any[] {
  return folders
    .filter((f) => f.parent_folder_id === parentId)
    .map((f) => ({ ...f, children: buildTree(folders, f.id) }));
}

export const foldersRoutes = {
  "/api/folders": {
    GET: () => {
      const db = getDB();
      const folders = db.query("SELECT * FROM folders ORDER BY name ASC").all();
      return Response.json(buildTree(folders));
    },
    POST: async (req: Request) => {
      const db = getDB();
      const { name, parent_folder_id = null } = await req.json();
      const result = db.run(
        "INSERT INTO folders (name, parent_folder_id) VALUES (?, ?)",
        [name, parent_folder_id],
      );
      const folder = db.query("SELECT * FROM folders WHERE id = ?").get(Number(result.lastInsertRowid));
      return Response.json(folder, { status: 201 });
    },
  },
  "/api/folders/:id": {
    PUT: async (req: Request & { params: { id: string } }) => {
      const db = getDB();
      const { name, parent_folder_id } = await req.json();
      const existing = db.query("SELECT * FROM folders WHERE id = ?").get(req.params.id) as any;
      if (!existing) return new Response("Not found", { status: 404 });
      db.run(
        "UPDATE folders SET name = ?, parent_folder_id = ?, updated_at = datetime('now') WHERE id = ?",
        [name ?? existing.name, parent_folder_id !== undefined ? parent_folder_id : existing.parent_folder_id, req.params.id],
      );
      const folder = db.query("SELECT * FROM folders WHERE id = ?").get(req.params.id);
      return Response.json(folder);
    },
    DELETE: (req: Request & { params: { id: string } }) => {
      const db = getDB();
      db.run("DELETE FROM folders WHERE id = ?", [req.params.id]);
      return new Response(null, { status: 204 });
    },
  },
  "/api/folders/:id/notes": {
    GET: (req: Request & { params: { id: string } }) => {
      const db = getDB();
      const notes = db.query(
        "SELECT * FROM notes WHERE folder_id = ? AND is_deleted = 0 ORDER BY title ASC",
      ).all(req.params.id);
      return Response.json(notes);
    },
  },
};
