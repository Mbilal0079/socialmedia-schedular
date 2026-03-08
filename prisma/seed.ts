import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...\n");

  // Delete existing data first (clean seed)
  await prisma.publishLog.deleteMany();
  await prisma.scheduledJob.deleteMany();
  await prisma.post.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const user = await prisma.user.create({
    data: {
      email: "demo@example.com",
      name: "Demo User",
      image: null,
    },
  });

  console.log(` Created user: ${user.name} (${user.email})`);

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        content:
          "Excited to announce our new social media scheduler! Built with Next.js, Prisma, and BullMQ. #webdev #typescript #nextjs",
        platforms: ["TWITTER", "LINKEDIN"],
        status: "PUBLISHED",
        publishedAt: new Date("2026-03-01T10:00:00Z"),
        userId: user.id,
      },
    }),
    prisma.post.create({
      data: {
        content:
          "Just shipped a new feature: calendar view for scheduled posts! You can now visualize your entire content pipeline at a glance.",
        platforms: ["TWITTER", "FACEBOOK", "INSTAGRAM"],
        status: "SCHEDULED",
        scheduledAt: new Date("2026-03-15T14:00:00Z"),
        userId: user.id,
      },
    }),
    prisma.post.create({
      data: {
        content:
          "Pro tip: Use BullMQ with Redis for reliable job scheduling. It handles retries, delays, and concurrency out of the box!",
        platforms: ["TWITTER"],
        status: "DRAFT",
        userId: user.id,
      },
    }),
    prisma.post.create({
      data: {
        content:
          "Behind the scenes: Our tech stack includes Next.js, Hono, MongoDB, Redis, and TypeScript all the way!",
        platforms: ["LINKEDIN", "TWITTER"],
        status: "PUBLISHED",
        publishedAt: new Date("2026-03-05T09:00:00Z"),
        userId: user.id,
      },
    }),
    prisma.post.create({
      data: {
        content:
          "Just integrated Cloudinary for image uploads. Now you can attach images to your scheduled posts!",
        platforms: ["INSTAGRAM", "FACEBOOK"],
        status: "SCHEDULED",
        scheduledAt: new Date("2026-03-20T16:30:00Z"),
        userId: user.id,
      },
    }),
    prisma.post.create({
      data: {
        content:
          "Failed to post due to API rate limit. Will retry automatically thanks to BullMQ's exponential backoff!",
        platforms: ["TWITTER"],
        status: "FAILED",
        errorMsg: "TWITTER: Rate limit exceeded (429)",
        userId: user.id,
      },
    }),
  ]);

  console.log(`Created ${posts.length} sample posts`);

  // Create scheduled jobs for scheduled posts
  const scheduledPosts = posts.filter((p) => p.status === "SCHEDULED");
  for (const post of scheduledPosts) {
    await prisma.scheduledJob.create({
      data: {
        bullJobId: `seed-job-${post.id}`,
        runAt: post.scheduledAt!,
        postId: post.id,
        userId: user.id,
        status: "pending",
      },
    });
  }

  console.log(`Created ${scheduledPosts.length} scheduled jobs`);

  // Create some publish logs for published posts
  const publishedPosts = posts.filter((p) => p.status === "PUBLISHED");
  for (const post of publishedPosts) {
    for (const platform of post.platforms) {
      await prisma.publishLog.create({
        data: {
          postId: post.id,
          platform: platform,
          success: true,
          response: JSON.stringify({
            platformPostId: `${platform.toLowerCase()}_${Date.now()}`,
          }),
        },
      });
    }
  }

  console.log(`Created publish logs for published posts`);
  console.log("\nSeeding complete!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
