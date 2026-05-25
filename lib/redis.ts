import { Redis } from "@upstash/redis";

// Initialize Upstash Redis
// Falls back to a dummy object if environment variables are missing during build/dev
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || "https://dummy-url.upstash.io",
  token: process.env.UPSTASH_REDIS_TOKEN || "dummy-token",
});

export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds = 300
): Promise<T> {
  try {
    const cached = await redis.get<T>(key);
    if (cached) return cached;
  } catch (error) {
    console.warn("[REDIS] Cache read error:", error);
  }

  const data = await fetcher();

  try {
    if (data) {
      await redis.setex(key, ttlSeconds, data);
    }
  } catch (error) {
    console.warn("[REDIS] Cache write error:", error);
  }

  return data;
}
