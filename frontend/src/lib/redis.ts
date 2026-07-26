import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | null | undefined;
};

function createRedisClient(): Redis | null {
  const url = process.env.REDIS_URL || "redis://localhost:6379";
  if (!url.startsWith("redis://") && !url.startsWith("rediss://")) {
    return null;
  }
  try {
    const parsedUrl = new URL(url);
    return new Redis({
      host: parsedUrl.hostname,
      port: parseInt(parsedUrl.port || "6379"),
      password: parsedUrl.password || undefined,
      tls: url.startsWith("rediss://") ? {} : undefined,
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
