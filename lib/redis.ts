import { unstable_cache } from "next/cache";

// Mock Upstash Redis object to prevent breaking imports
export const redis = {
  get: async () => null,
  setex: async () => "OK",
  del: async () => 1,
};

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
