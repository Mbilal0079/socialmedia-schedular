import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updatePostSchema } from "@/lib/validations/post";
import {
  schedulePost,
  cancelScheduledPost,
  reschedulePost,
} from "@/lib/queue";

// GET /api/posts/[id] - Get a single post
export async function GET(
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
      include: {
        scheduledJob: true,
        publishLogs: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("GET /api/posts/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PATCH /api/posts/[id] - Update a post
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Check post exists and belongs to user
    const existingPost = await prisma.post.findFirst({
      where: { id, userId: session.user.id },
      include: { scheduledJob: true },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Cannot edit published posts
    if (existingPost.status === "PUBLISHED") {
      return NextResponse.json(
        { error: "Cannot edit published posts" },
        { status: 400 }
      );
    }

    const validation = updatePostSchema.safeParse({ ...body, id });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { content, platforms, scheduledAt, mediaUrls, status } =
      validation.data;

    // Handle schedule changes
    if (scheduledAt && scheduledAt !== existingPost.scheduledAt?.toISOString()) {
      // Reschedule
      if (existingPost.scheduledJob) {
        await reschedulePost(
          {
            postId: id,
            userId: session.user.id,
            content: content || existingPost.content,
            platforms: platforms || existingPost.platforms,
            mediaUrls: mediaUrls || existingPost.mediaUrls,
          },
          new Date(scheduledAt)
        );
      } else {
        // Schedule for the first time
        const jobId = await schedulePost(
          {
            postId: id,
            userId: session.user.id,
            content: content || existingPost.content,
            platforms: platforms || existingPost.platforms,
            mediaUrls: mediaUrls || existingPost.mediaUrls,
          },
          new Date(scheduledAt)
        );

        await prisma.scheduledJob.create({
          data: {
            bullJobId: jobId,
            runAt: new Date(scheduledAt),
            postId: id,
            userId: session.user.id,
          },
        });
      }
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(content && { content }),
        ...(platforms && { platforms }),
        ...(mediaUrls && { mediaUrls }),
        ...(scheduledAt && {
          scheduledAt: new Date(scheduledAt),
          status: "SCHEDULED",
        }),
        ...(status && { status }),
      },
      include: {
        scheduledJob: true,
        publishLogs: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("PATCH /api/posts/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(
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

    // Cancel scheduled job if exists
    await cancelScheduledPost(id);

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    console.error("DELETE /api/posts/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
