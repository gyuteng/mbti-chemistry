// GET /api/map?owner=ID → { owner, connections }
import { redis } from "./_redis.js";
export default async function handler(req, res) {
  try {
    const owner = req.query.owner;
    if (!owner) return res.status(400).json({ error: "owner" });
    const rec = await redis.get(`owner:${owner}`);
    if (!rec) return res.status(404).json({ error: "not found" });
    const connections = (await redis.get(`conn:${owner}`)) || [];
    return res.status(200).json({ owner: rec, connections });
  } catch (e) {
    return res.status(500).json({ error: "server", detail: String(e && e.message || e) });
  }
}
