// Upstash Redis 클라이언트 (KV_REST_API_URL / KV_REST_API_TOKEN 사용)
import { Redis } from "@upstash/redis";
export const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});
