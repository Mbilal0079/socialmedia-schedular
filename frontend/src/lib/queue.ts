import { Queue } from "bullmq";

function getRedisConnection() {
  const url = process.env.REDIS_URL || "redis://localhost:6379";
  // Only connect if we have a redis:// or rediss:// URL (not https:// REST URLs)
  if (!url.startsWith("redis://") && !url.startsWith("rediss://")) {
    return null;
  }
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parseInt(parsed.port || "6379"),
      password: parsed.password || undefined,
      tls: url.startsWith("rediss://") ? {} : undefined,
    };
  } catch {
    return null;
  }
}

const redisConnection = getRedisConnection();

export const publishQueue = redisConnection
  ? new Queue("post-publish", {
      connection: redisConnection,
      defaultJobOptions: {
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 },
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      },
    })
  : null;

export interface PublishJobData {
  postId: string;
  userId: string;
  content: string;
  platforms: string[];
  mediaUrls: string[];
}

/**
 * Schedule a post for publishing at a specific time
 * Returns null if Redis/queue is not available
 */
export async function schedulePost(
  data: PublishJobData,
  publishAt: Date
): Promise<string | null> {
  if (!publishQueue) {
    console.log("Queue not available - post saved to DB but not queued");
    return null;
  }

  const delay = publishAt.getTime() - Date.now();

  if (delay <= 0) {
    const job = await publishQueue.add("publish-now", data);
    return job.id!;
  }

  const job = await publishQueue.add("publish-scheduled", data, {
    delay,
    jobId: `post-${data.postId}`,
  });

  return job.id!;
}

/**
 * Cancel a scheduled post
 */
export async function cancelScheduledPost(postId: string): Promise<boolean> {
  if (!publishQueue) return false;
  const job = await publishQueue.getJob(`post-${postId}`);
  if (job) {
    await job.remove();
    return true;
  }
  return false;
}

/**
 * Reschedule a post
 */
export async function reschedulePost(
  data: PublishJobData,
  newPublishAt: Date
): Promise<string | null> {
  await cancelScheduledPost(data.postId);
  return schedulePost(data, newPublishAt);
}
