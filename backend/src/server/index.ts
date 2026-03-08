import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { PrismaClient } from "@prisma/client";
import { publishWorker } from "../worker";
import { publishQueue } from "../queue";

// Load environment variables
import "dotenv/config";

const app = new Hono();
const prisma = new PrismaClient();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
    credentials: true,
  })
);

// ============================================
// HEALTH CHECK
// ============================================
app.get("/", (c) => {
  return c.json({
    status: "ok",
    service: "Social Media Scheduler - Background Worker",
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// QUEUE DASHBOARD ENDPOINTS
// ============================================
app.get("/api/queue/stats", async (c) => {
  try {
    const waiting = await publishQueue.getWaitingCount();
    const active = await publishQueue.getActiveCount();
    const completed = await publishQueue.getCompletedCount();
    const failed = await publishQueue.getFailedCount();
    const delayed = await publishQueue.getDelayedCount();

    return c.json({
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed,
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch queue stats" }, 500);
  }
});

app.get("/api/queue/jobs", async (c) => {
  try {
    const status = c.req.query("status") || "delayed";
    let jobs;

    switch (status) {
      case "waiting":
        jobs = await publishQueue.getWaiting(0, 50);
        break;
      case "active":
        jobs = await publishQueue.getActive(0, 50);
        break;
      case "completed":
        jobs = await publishQueue.getCompleted(0, 50);
        break;
      case "failed":
        jobs = await publishQueue.getFailed(0, 50);
        break;
      case "delayed":
        jobs = await publishQueue.getDelayed(0, 50);
        break;
      default:
        jobs = await publishQueue.getDelayed(0, 50);
    }

    return c.json(
      jobs.map((job) => ({
        id: job.id,
        name: job.name,
        data: job.data,
        delay: job.opts.delay,
        timestamp: job.timestamp,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn,
      }))
    );
  } catch (error) {
    return c.json({ error: "Failed to fetch jobs" }, 500);
  }
});

app.delete("/api/queue/jobs/:jobId", async (c) => {
  try {
    const jobId = c.req.param("jobId");
    const job = await publishQueue.getJob(jobId);

    if (!job) {
      return c.json({ error: "Job not found" }, 404);
    }

    await job.remove();
    return c.json({ message: "Job removed successfully" });
  } catch (error) {
    return c.json({ error: "Failed to remove job" }, 500);
  }
});

// ============================================
// ANALYTICS ENDPOINTS
// ============================================
app.get("/api/analytics/overview", async (c) => {
  try {
    const [totalPosts, published, scheduled, failed] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.post.count({ where: { status: "SCHEDULED" } }),
      prisma.post.count({ where: { status: "FAILED" } }),
    ]);

    const recentPublished = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 10,
      select: {
        id: true,
        content: true,
        platforms: true,
        publishedAt: true,
      },
    });

    return c.json({
      totalPosts,
      published,
      scheduled,
      failed,
      successRate: totalPosts > 0 ? ((published / totalPosts) * 100).toFixed(1) : 0,
      recentPublished,
    });
  } catch (error) {
    return c.json({ error: "Failed to fetch analytics" }, 500);
  }
});

// ============================================
// START SERVER
// ============================================
const port = parseInt(process.env.HONO_PORT || "4000");

console.log(`\nHono Backend Server starting on port ${port}`);
console.log(`Queue Worker is active and listening for jobs`);
console.log(`CORS enabled for: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}\n`);

// Keep reference to worker to prevent garbage collection
console.log(`Worker status: ${publishWorker.isRunning() ? "Running" : "Starting..."}`);

serve({
  fetch: app.fetch,
  port,
});
