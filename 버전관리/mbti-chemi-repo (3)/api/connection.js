// POST /api/connection  { owner, conn } → { ok, connections }
import { redis } from "./_redis.js";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  try {
    const { owner, conn } = req.body || {};
    if (!owner || !conn || !conn.name) return res.status(400).json({ error: "missing" });
    const key = `conn:${owner}`;
    const list = (await redis.get(key)) || [];
    const next = [...list.filter((c) => c.name !== conn.name), conn].slice(0, 200);
    await redis.set(key, next);
    return res.status(200).json({ ok: true, connections: next });
  } catch (e) {
    return res.status(500).json({ error: "server", detail: String(e && e.message || e) });
  }
}
