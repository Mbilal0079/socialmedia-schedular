"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  PenSquare,
  ArrowUpRight,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { usePostStore } from "@/store/post-store";
import { useUIStore } from "@/store/ui-store";

interface AnalyticsData {
  overview: {
    totalPosts: number;
    drafts: number;
    scheduled: number;
    published: number;
    failed: number;
    successRate: string;
  };
  recentPosts: Array<{
    id: string;
    content: string;
    platforms: string[];
    status: string;
    scheduledAt: string | null;
    publishedAt: string | null;
    createdAt: string;
  }>;
  upcomingPosts: Array<{
    id: string;
    content: string;
    platforms: string[];
    scheduledAt: string;
  }>;
}

export function DashboardContent() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { setCreatePostDialogOpen } = useUIStore();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const statCards = [
    {
      title: "Total Posts",
      value: analytics?.overview.totalPosts || 0,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Scheduled",
      value: analytics?.overview.scheduled || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      title: "Published",
      value: analytics?.overview.published || 0,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Success Rate",
      value: `${analytics?.overview.successRate || 0}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your social media posts
          </p>
        </div>
        <Button onClick={() => setCreatePostDialogOpen(true)} size="lg">
          <PenSquare className="mr-2 h-5 w-5" />
          New Post
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="flex items-center gap-4 p-6">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}
                >
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Posts</CardTitle>
            <Link href="/dashboard/posts">
              <Button variant="ghost" size="sm">
                View All <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics?.recentPosts.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No posts yet. Create your first one!
              </p>
            ) : (
              analytics?.recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {post.content.substring(0, 60)}
                      {post.content.length > 60 ? "..." : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(post.createdAt), "MMM d, h:mm a")}
                    </p>
                  </div>
                  <Badge
                    variant={
                      post.status === "PUBLISHED"
                        ? "default"
                        : post.status === "FAILED"
                        ? "destructive"
                        : "secondary"
                    }
                    className="ml-3"
                  >
                    {post.status.toLowerCase()}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Scheduled */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Scheduled</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics?.upcomingPosts.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No upcoming posts scheduled
              </p>
            ) : (
              analytics?.upcomingPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {post.content.substring(0, 60)}
                      {post.content.length > 60 ? "..." : ""}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(
                        new Date(post.scheduledAt),
                        "MMM d, h:mm a"
                      )}
                    </div>
                  </div>
                  <div className="ml-3 flex gap-1">
                    {post.platforms.map((p) => (
                      <Badge key={p} variant="outline" className="text-xs">
                        {p.toLowerCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
