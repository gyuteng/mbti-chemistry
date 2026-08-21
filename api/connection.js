// POST /api/connection { owner, conn, guestOwnerId?, guestSelf? } → { ok, connections, guestOwnerId }
// 양방향: 게스트가 owner 지도에 합류하면, 게스트의 지도에도 owner를 상호 등록한다.
import { redis } from "./_redis.js";
import { shortId } from "./_id.js";

async function addTo(ownerId, entry) {
  const key = `conn:${ownerId}`;
  const list = (await redis.get(key)) || [];
  // oid가 있으면 oid로만 식별(동명이인 덮어쓰기 방지), oid가 없을 때만 name으로 식별
  const dedup = list.filter((c) =>
    entry.oid ? c.oid !== entry.oid : (c.oid ? true : c.name !== entry.name)
  );
  const next = [...dedup, entry].slice(0, 500);
  await redis.set(key, next);
  return next;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  try {
    const { owner, conn, guestOwnerId, guestSelf } = req.body || {};
    if (!owner || !conn || !conn.name || !conn.mbti) return res.status(400).json({ error: "missing" });

    const ownerRec = await redis.get(`owner:${owner}`);
    if (!ownerRec) return res.status(404).json({ error: "owner not found" });

    // 1) 게스트에게도 owner_id 보장 (없으면 즉시 발급 → 게스트가 자기 지도를 가질 수 있음)
    let gid = guestOwnerId;
    if (!gid) {
      gid = shortId(8);
      const gRec = guestSelf && guestSelf.axes
        ? { name: conn.name, mbti: conn.mbti, axes: guestSelf.axes, createdAt: Date.now() }
        : { name: conn.name, mbti: conn.mbti, axes: null, createdAt: Date.now() };
      await redis.set(`owner:${gid}`, gRec);
      if (!(await redis.get(`conn:${gid}`))) await redis.set(`conn:${gid}`, []);
    }

    // 2) owner 지도에 게스트 추가 (oid = 게스트 owner_id)
    const ownerNext = await addTo(owner, { ...conn, oid: gid });

    // 3) 게스트 지도에 owner 상호 등록 (owner의 유형/케미 = 동일 케미 대칭)
    const back = {
      oid: owner,
      name: ownerRec.name,
      mbti: ownerRec.mbti,
      chemi: conn.chemi,
      type: conn.type,
      scores: conn.scores,
    };
    await addTo(gid, back);

    return res.status(200).json({ ok: true, connections: ownerNext, guestOwnerId: gid });
  } catch (e) {
    return res.status(500).json({ error: "server", detail: String((e && e.message) || e) });
  }
}
