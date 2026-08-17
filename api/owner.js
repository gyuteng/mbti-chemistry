// POST /api/owner  { name, mbti, axes } → { ownerId }
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const { name, mbti, axes } = req.body || {};
  if (!mbti || !axes) return res.status(400).json({ error: "missing" });
  const ownerId = nanoid(8);
  await kv.set(`owner:${ownerId}`, { name: name || "나", mbti, axes, createdAt: Date.now() });
  await kv.set(`conn:${ownerId}`, []);
  return res.status(200).json({ ownerId });
}
