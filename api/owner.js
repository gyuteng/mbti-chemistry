// POST /api/owner  { name, mbti, axes } → { ownerId }
import { redis } from "./_redis.js";
import { shortId } from "./_id.js";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  try {
    const { name, mbti, axes } = req.body || {};
    if (!mbti || !axes) return res.status(400).json({ error: "missing" });
    const ownerId = shortId(8);
    await redis.set(`owner:${ownerId}`, { name: name || "나", mbti, axes, createdAt: Date.now() });
    await redis.set(`conn:${ownerId}`, []);
    return res.status(200).json({ ownerId });
  } catch (e) {
    return res.status(500).json({ error: "server", detail: String(e && e.message || e) });
  }
}
