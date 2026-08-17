// GET /api/map?owner=ID → { owner, connections }
import { kv } from "@vercel/kv";
export default async function handler(req, res) {
  const owner = req.query.owner;
  if (!owner) return res.status(400).json({ error: "owner" });
  const rec = await kv.get(`owner:${owner}`);
  if (!rec) return res.status(404).json({ error: "not found" });
  const connections = (await kv.get(`conn:${owner}`)) || [];
  return res.status(200).json({ owner: rec, connections });
}
