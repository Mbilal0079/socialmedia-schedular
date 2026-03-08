import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/analytics - Get analytics for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [totalPosts, drafts, scheduled, published, failed, recentPosts, platformStats] =
      await Promise.all([
        prisma.post.count({ where: { userId } }),
        prisma.post.count({ where: { userId, status: "DRAFT" } }),
        prisma.post.count({ where: { userId, status: "SCHEDULED" } }),
        prisma.post.count({ where: { userId, status: "PUBLISHED" } }),
        prisma.post.count({ where: { userId, status: "FAILED" } }),
        prisma.post.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            content: true,
            platforms: true,
            status: true,
            scheduledAt: true,
            publishedAt: true,
            createdAt: true,
          },
        }),
        prisma.publishLog.groupBy({
          by: ["platform"],
          where: { post: { userId } },
          _count: { _all: true },
        }),
      ]);

    // Upcoming scheduled posts
    const upcomingPosts = await prisma.post.findMany({
      where: {
        userId,
        status: "SCHEDULED",
        scheduledAt: { gt: new Date() },
      },
      orderBy: { scheduledAt: "asc" },
      take: 10,
      select: {
        id: true,
        content: true,
        platforms: true,
        scheduledAt: true,
      },
    });

    return NextResponse.json({
      overview: {
        totalPosts,
        drafts,
        scheduled,
        published,
        failed,
        successRate:
          totalPosts > 0
            ? ((published / (published + failed || 1)) * 100).toFixed(1)
            : "0",
      },
      recentPosts,
      upcomingPosts,
      platformStats,
    });
  } catch (error) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
