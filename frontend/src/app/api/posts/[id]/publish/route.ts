import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { schedulePost } from "@/lib/queue";

// POST /api/posts/[id]/publish - Publish a post immediately
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const post = await prisma.post.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.status === "PUBLISHED") {
      return NextResponse.json(
        { error: "Post already published" },
        { status: 400 }
      );
    }

    // Schedule for immediate publishing
    const jobId = await schedulePost(
      {
        postId: post.id,
        userId: session.user.id,
        content: post.content,
        platforms: post.platforms,
        mediaUrls: post.mediaUrls,
      },
      new Date() // Now
    );

    // Update post status
    await prisma.post.update({
      where: { id },
      data: { status: "SCHEDULED" },
    });

    // Create/update scheduled job
    await prisma.scheduledJob.upsert({
      where: { postId: id },
      create: {
        bullJobId: jobId,
        runAt: new Date(),
        postId: id,
        userId: session.user.id,
      },
      update: {
        bullJobId: jobId,
        runAt: new Date(),
        status: "pending",
      },
    });

    return NextResponse.json({ message: "Post queued for immediate publishing" });
  } catch (error) {
    console.error("POST /api/posts/[id]/publish error:", error);
    return NextResponse.json(
      { error: "Failed to publish post" },
      { status: 500 }
    );
  }
}
