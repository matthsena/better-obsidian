import { getDB } from "../db/database";

export const dailyNotesRoutes = {
  "/api/daily-notes": {
    POST: () => {
      const db = getDB();
      const today = new Date().toISOString().slice(0, 10);
      const title = `Daily Note — ${today}`;

      const existing = db.query(
        "SELECT * FROM notes WHERE title = ? AND is_deleted = 0",
      ).get(title) as any;

      if (existing) return Response.json(existing);

      const content = `# ${title}\n\n## Tasks\n\n- [ ] \n\n## Notes\n\n`;
      const result = db.run(
        "INSERT INTO notes (title, content) VALUES (?, ?)",
        [title, content],
      );
      const note = db.query("SELECT * FROM notes WHERE id = ?").get(Number(result.lastInsertRowid));
      return Response.json(note, { status: 201 });
    },
  },
};
