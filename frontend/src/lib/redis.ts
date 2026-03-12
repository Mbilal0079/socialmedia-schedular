import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | null | undefined;
};

function createRedisClient(): Redis | null {
  const url = process.env.REDIS_URL || "redis://localhost:6379";
  // Only create client for direct redis connections, not REST APIs
  if (!url.startsWith("redis://") && !url.startsWith("rediss://")) {
    return null;
  }
  try {
    return new Redis(url, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
    });
  } catch {
    return null;
  }
}

export const redis =
  globalForRedis.redis !== undefined
    ? globalForRedis.redis
    : createRedisClient();

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

export default redis;
