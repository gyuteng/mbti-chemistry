// POST /api/feedback { category, message, owner?, mbti? } → { ok }
// GET  /api/feedback?key=<ADMIN_KEY>&n=50 → { items }  (관리자 조회)
import { redis } from "./_redis.js";
import { shortId } from "./_id.js";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { category, message, owner, mbti } = req.body || {};
      if (!category || !message || !String(message).trim()) return res.status(400).json({ error: "missing" });
      const id = shortId(10);
      const item = {
        id, category,
        message: String(message).slice(0, 1000),
        owner: owner || null, mbti: mbti || null,
        ua: (req.headers["user-agent"] || "").slice(0, 200),
        at: Date.now(),
      };
      await redis.set(`fb:${id}`, item);
      await redis.lpush("fb:list", id); // 최신순 인덱스
      return res.status(200).json({ ok: true });
    }
    if (req.method === "GET") {
      const key = req.query.key;
      if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) return res.status(401).json({ error: "unauthorized" });
      const n = Math.min(parseInt(req.query.n || "50", 10), 200);
      const ids = (await redis.lrange("fb:list", 0, n - 1)) || [];
      const items = [];
      for (const id of ids) { const it = await redis.get(`fb:${id}`); if (it) items.push(it); }
      return res.status(200).json({ items });
    }
    return res.status(405).json({ error: "method" });
  } catch (e) {
    return res.status(500).json({ error: "server", detail: String((e && e.message) || e) });
  }
}
