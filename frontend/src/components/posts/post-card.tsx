"use client";

import { format } from "date-fns";
import {
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  MoreVertical,
  Send,
  Trash2,
  Edit,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Post, usePostStore } from "@/store/post-store";
import { Platform, PostStatus } from "@/lib/validations/post";
import { cn } from "@/lib/utils";

const platformIcons: Record<Platform, React.ElementType> = {
  TWITTER: Twitter,
  FACEBOOK: Facebook,
  LINKEDIN: Linkedin,
  INSTAGRAM: Instagram,
};

const platformColors: Record<Platform, string> = {
  TWITTER: "text-sky-500",
  FACEBOOK: "text-blue-600",
  LINKEDIN: "text-blue-700",
  INSTAGRAM: "text-pink-500",
};

const statusConfig: Record<
  PostStatus,
  { label: string; icon: React.ElementType; variant: "default" | "secondary" | "destructive" | "outline"; color: string }
> = {
  DRAFT: {
    label: "Draft",
    icon: FileText,
    variant: "secondary",
    color: "text-muted-foreground",
  },
  SCHEDULED: {
    label: "Scheduled",
    icon: Clock,
    variant: "outline",
    color: "text-yellow-600",
  },
  PUBLISHED: {
    label: "Published",
    icon: CheckCircle2,
    variant: "default",
    color: "text-green-600",
  },
  FAILED: {
    label: "Failed",
    icon: AlertCircle,
    variant: "destructive",
    color: "text-destructive",
  },
};

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { removePost, updatePost } = usePostStore();
  const statusInfo = statusConfig[post.status];
  const StatusIcon = statusInfo.icon;

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      removePost(post.id);
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const handlePublishNow = async () => {
    try {
      const res = await fetch(`/api/posts/${post.id}/publish`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to publish");

      updatePost(post.id, { status: "SCHEDULED" });
      toast.success("Post queued for publishing!");
    } catch {
      toast.error("Failed to publish post");
    }
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Badge variant={statusInfo.variant} className="gap-1">
            <StatusIcon className="h-3 w-3" />
            {statusInfo.label}
          </Badge>
          {post.scheduledAt && (
            <span className="text-xs text-muted-foreground">
              {format(new Date(post.scheduledAt), "MMM d, h:mm a")}
            </span>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {post.status === "DRAFT" && (
              <DropdownMenuItem onClick={handlePublishNow}>
                <Send className="mr-2 h-4 w-4" />
                Publish Now
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        <p className="text-sm leading-relaxed">
          {post.content.length > 200
            ? `${post.content.substring(0, 200)}...`
            : post.content}
        </p>

        {post.mediaUrls.length > 0 && (
          <div className="mt-3 flex gap-2">
            {post.mediaUrls.slice(0, 3).map((url, i) => (
              <div
                key={i}
                className="h-16 w-16 overflow-hidden rounded-lg border"
              >
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
            {post.mediaUrls.length > 3 && (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border bg-muted text-sm font-medium">
                +{post.mediaUrls.length - 3}
              </div>
            )}
          </div>
        )}

        {post.errorMsg && (
          <div className="mt-3 rounded-lg bg-destructive/10 p-2 text-xs text-destructive">
            {post.errorMsg}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-0">
        <div className="flex gap-1.5">
          {post.platforms.map((platform) => {
            const Icon = platformIcons[platform];
            return (
              <Icon
                key={platform}
                className={cn("h-4 w-4", platformColors[platform])}
              />
            );
          })}
        </div>
        <span className="text-xs text-muted-foreground">
          {format(new Date(post.createdAt), "MMM d, yyyy")}
        </span>
      </CardFooter>
    </Card>
  );
}
