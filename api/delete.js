// POST /api/delete { owner, name } → { ok, connections }
// 오너 지도에서 특정 연결(name)을 영구 삭제. (상호등록 특성상 상대 지도의 내 항목은 유지)
import { redis } from "./_redis.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  try {
    const { owner, name } = req.body || {};
    if (!owner || !name) return res.status(400).json({ error: "missing" });
    const key = `conn:${owner}`;
    const list = (await redis.get(key)) || [];
    const next = list.filter((c) => c.name !== name);
    await redis.set(key, next);
    return res.status(200).json({ ok: true, connections: next });
  } catch (e) {
    return res.status(500).json({ error: "server", detail: String((e && e.message) || e) });
  }
}
