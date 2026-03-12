import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createPostSchema } from "@/lib/validations/post";
import { schedulePost } from "@/lib/queue";

// GET /api/posts - Get all posts for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = { userId: session.user.id };
    if (status && status !== "ALL") {
      where.status = status;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          scheduledJob: true,
          publishLogs: true,
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = createPostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { content, platforms, scheduledAt, mediaUrls } = validation.data;
    const isScheduled = !!scheduledAt;

    // Create the post
    const post = await prisma.post.create({
      data: {
        content,
        platforms,
        mediaUrls: mediaUrls || [],
        status: isScheduled ? "SCHEDULED" : "DRAFT",
        scheduledAt: isScheduled ? new Date(scheduledAt!) : null,
        userId: session.user.id,
      },
    });

    // If scheduled, add to BullMQ queue (if Redis is available)
    if (isScheduled) {
      const jobId = await schedulePost(
        {
          postId: post.id,
          userId: session.user.id,
          content,
          platforms,
          mediaUrls: mediaUrls || [],
        },
        new Date(scheduledAt!)
      );

      // Create scheduled job record
      await prisma.scheduledJob.create({
        data: {
          bullJobId: jobId || `pending-${post.id}`,
          runAt: new Date(scheduledAt!),
          postId: post.id,
          userId: session.user.id,
        },
      });
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
