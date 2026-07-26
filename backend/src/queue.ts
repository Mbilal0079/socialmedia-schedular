import { Queue } from "bullmq";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const parsedUrl = new URL(redisUrl);

const connection = {
  host: parsedUrl.hostname,
  port: parseInt(parsedUrl.port || "6379"),
  password: parsedUrl.password || undefined,
  tls: redisUrl.startsWith("rediss://") ? {} : undefined,
};

export const publishQueue = new Queue("post-publish", {
  connection,
  defaultJobOptions: {
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  },
});

export interface PublishJobData {
  postId: string;
  userId: string;
  content: string;
  platforms: string[];
  mediaUrls: string[];
}

/**
 * Schedule a post for publishing at a specific time
 */
export async function schedulePost(
  data: PublishJobData,
  publishAt: Date
): Promise<string> {
  const delay = publishAt.getTime() - Date.now();

  if (delay <= 0) {
    // Publish immediately
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
): Promise<string> {
  await cancelScheduledPost(data.postId);
  return schedulePost(data, newPublishAt);
}
