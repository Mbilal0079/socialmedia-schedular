import { Worker } from "bullmq";
import { PrismaClient } from "@prisma/client";
import type { PublishJobData } from "./queue";

const prisma = new PrismaClient();
const connection = {
  host: new URL(process.env.REDIS_URL || "redis://localhost:6379").hostname,
  port: parseInt(new URL(process.env.REDIS_URL || "redis://localhost:6379").port || "6379"),
};

/**
 * Simulated platform publishers
 * Replace these with real API integrations
 */
async function publishToTwitter(content: string, mediaUrls: string[]) {
  console.log(`[Twitter] Publishing: "${content.substring(0, 50)}..."`);
  // TODO: Integrate with Twitter API v2
  // const tweet = await twitterClient.tweets.create({ text: content });
  return { success: true, platformPostId: `tw_${Date.now()}` };
}

async function publishToFacebook(content: string, mediaUrls: string[]) {
  console.log(`[Facebook] Publishing: "${content.substring(0, 50)}..."`);
  // TODO: Integrate with Facebook Graph API
  return { success: true, platformPostId: `fb_${Date.now()}` };
}

async function publishToLinkedIn(content: string, mediaUrls: string[]) {
  console.log(`[LinkedIn] Publishing: "${content.substring(0, 50)}..."`);
  // TODO: Integrate with LinkedIn API
  return { success: true, platformPostId: `li_${Date.now()}` };
}

async function publishToInstagram(content: string, mediaUrls: string[]) {
  console.log(`[Instagram] Publishing: "${content.substring(0, 50)}..."`);
  // TODO: Integrate with Instagram Graph API
  return { success: true, platformPostId: `ig_${Date.now()}` };
}

const platformPublishers: Record<
  string,
  (content: string, mediaUrls: string[]) => Promise<{ success: boolean; platformPostId: string }>
> = {
  TWITTER: publishToTwitter,
  FACEBOOK: publishToFacebook,
  LINKEDIN: publishToLinkedIn,
  INSTAGRAM: publishToInstagram,
};

/**
 * BullMQ Worker that processes scheduled posts
 */
export const publishWorker = new Worker(
  "post-publish",
  async (job) => {
    const data = job.data as PublishJobData;
    console.log(`\nProcessing job ${job.id} for post ${data.postId}`);

    // Update job status
    await prisma.scheduledJob.updateMany({
      where: { postId: data.postId },
      data: { status: "processing" },
    });

    const results: Array<{
      platform: string;
      success: boolean;
      response?: string;
      error?: string;
    }> = [];

    // Publish to each platform
    for (const platform of data.platforms) {
      try {
        const publisher = platformPublishers[platform];
        if (!publisher) {
          throw new Error(`No publisher for platform: ${platform}`);
        }

        const result = await publisher(data.content, data.mediaUrls);

        // Log success
        await prisma.publishLog.create({
          data: {
            postId: data.postId,
            platform: platform as any,
            success: true,
            response: JSON.stringify(result),
          },
        });

        results.push({
          platform,
          success: true,
          response: JSON.stringify(result),
        });

        console.log(`  [OK] ${platform}: Published successfully`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";

        // Log failure
        await prisma.publishLog.create({
          data: {
            postId: data.postId,
            platform: platform as any,
            success: false,
            error: errorMsg,
          },
        });

        results.push({ platform, success: false, error: errorMsg });
        console.log(`  [FAIL] ${platform}: Failed - ${errorMsg}`);
      }
    }

    // Update post status
    const allSuccessful = results.every((r) => r.success);
    const anySuccessful = results.some((r) => r.success);

    await prisma.post.update({
      where: { id: data.postId },
      data: {
        status: allSuccessful ? "PUBLISHED" : "FAILED",
        publishedAt: anySuccessful ? new Date() : null,
        errorMsg: allSuccessful
          ? null
          : results
              .filter((r) => !r.success)
              .map((r) => `${r.platform}: ${r.error}`)
              .join("; "),
      },
    });

    // Update scheduled job status
    await prisma.scheduledJob.updateMany({
      where: { postId: data.postId },
      data: { status: allSuccessful ? "completed" : "failed" },
    });

    console.log(
      `\nJob ${job.id} completed: ${results.filter((r) => r.success).length}/${results.length} platforms succeeded\n`
    );

    return results;
  },
  {
    connection,
    concurrency: 5,
  }
);

// Worker event handlers
publishWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

publishWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

publishWorker.on("error", (err) => {
  console.error("Worker error:", err);
});
