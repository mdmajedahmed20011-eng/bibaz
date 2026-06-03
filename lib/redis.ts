import { unstable_cache } from "next/cache";
import { Redis } from "@upstash/redis";

// Instantiate real Redis if configured, otherwise fall back to mock
let redisClient: {
  get: (key: string) => Promise<string | null>;
  set: (
    key: string,
    value: string,
    options?: { px?: number; nx?: boolean; ex?: number }
  ) => Promise<string | null>;
  del: (key: string) => Promise<number>;
  incr: (key: string) => Promise<number>;
};

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  }) as unknown as typeof redisClient;
} else {
  // In-memory local lock fallback to prevent local dev environment from breaking
  const memoryStore = new Map<string, { value: string; expiresAt: number }>();
  redisClient = {
    get: async (key: string) => {
      const entry = memoryStore.get(key);
      if (!entry) return null;
      if (Date.now() > entry.expiresAt) {
        memoryStore.delete(key);
        return null;
      }
      return entry.value;
    },
    set: async (
      key: string,
      value: string,
      options?: { px?: number; nx?: boolean; ex?: number }
    ) => {
      const now = Date.now();
      const entry = memoryStore.get(key);
      if (options?.nx && entry && now <= entry.expiresAt) {
        return null; // Key already exists and has not expired
      }
      let durationMs = 30000; // default 30s
      if (options?.px) durationMs = options.px;
      else if (options?.ex) durationMs = options.ex * 1000;

      memoryStore.set(key, { value, expiresAt: now + durationMs });
      return "OK";
    },
    del: async (key: string) => {
      const deleted = memoryStore.delete(key) ? 1 : 0;
      return deleted;
    },
    incr: async (key: string) => {
      const now = Date.now();
      const entry = memoryStore.get(key);
      let val = 1;
      if (entry && now <= entry.expiresAt) {
        val = parseInt(entry.value) + 1;
      }
      memoryStore.set(key, { value: val.toString(), expiresAt: now + 31536000000 }); // 1 year
      return val;
    }
  };
}

export const redis = redisClient;

/**
 * Acquire distributed lock for product variants during checkout.
 * Retries up to 3 times with 150ms backoff if lock is held.
 */
export async function acquireInventoryLocks(variantIds: string[]): Promise<boolean> {
  const acquiredLocks: string[] = [];

  for (const id of variantIds) {
    const lockKey = `lock:variant:${id}`;
    let attempts = 0;
    let locked = false;

    while (attempts < 3 && !locked) {
      const res = await redis.set(lockKey, "locked", { px: 5000, nx: true });
      if (res === "OK") {
        locked = true;
        acquiredLocks.push(lockKey);
      } else {
        attempts++;
        if (attempts < 3) {
          await new Promise((resolve) => setTimeout(resolve, 150));
        }
      }
    }

    if (!locked) {
      // Release any locks acquired so far to prevent deadlocks
      await releaseInventoryLocks(acquiredLocks.map((key) => key.replace("lock:variant:", "")));
      return false;
    }
  }

  return true;
}

/**
 * Release inventory locks after checkout processing completes.
 */
export async function releaseInventoryLocks(variantIds: string[]): Promise<void> {
  for (const id of variantIds) {
    const lockKey = `lock:variant:${id}`;
    await redis.del(lockKey);
  }
}

export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds = 300
): Promise<T> {
  try {
    const cachedFn = unstable_cache(
      async () => {
        return await fetcher();
      },
      [key],
      { revalidate: ttlSeconds, tags: [key] }
    );
    return await cachedFn();
  } catch (error) {
    console.warn("[CACHE] Fallback to direct fetch due to cache error:", error);
    return await fetcher();
  }
}
