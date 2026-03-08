"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalyticsData {
  overview: {
    totalPosts: number;
    drafts: number;
    scheduled: number;
    published: number;
    failed: number;
    successRate: string;
  };
  platformStats: Array<{
    platform: string;
    _count: { _all: number };
  }>;
}

const platformConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  TWITTER: { icon: Twitter, color: "text-sky-500", bgColor: "bg-sky-100 dark:bg-sky-900/30" },
  FACEBOOK: { icon: Facebook, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  LINKEDIN: { icon: Linkedin, color: "text-blue-700", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  INSTAGRAM: { icon: Instagram, color: "text-pink-500", bgColor: "bg-pink-100 dark:bg-pink-900/30" },
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
        </div>
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

  const overview = analytics?.overview;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Track your social media performance
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="text-2xl font-bold">{overview?.published || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold">{overview?.failed || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">{overview?.successRate || 0}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Posts</p>
              <p className="text-2xl font-bold">{overview?.totalPosts || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(platformConfig).map(([platform, config]) => {
              const Icon = config.icon;
              const stat = analytics?.platformStats?.find(
                (s) => s.platform === platform
              );
              const count = stat?._count._all || 0;

              return (
                <div
                  key={platform}
                  className="flex items-center gap-4 rounded-xl border p-4"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bgColor}`}
                  >
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {platform.toLowerCase()}
                    </p>
                    <p className="text-lg font-bold">{count} posts</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Post Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Post Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "Drafts", value: overview?.drafts || 0, color: "bg-gray-500" },
              { label: "Scheduled", value: overview?.scheduled || 0, color: "bg-yellow-500" },
              { label: "Published", value: overview?.published || 0, color: "bg-green-500" },
              { label: "Failed", value: overview?.failed || 0, color: "bg-red-500" },
            ].map((item) => {
              const total = overview?.totalPosts || 1;
              const percentage = ((item.value / total) * 100).toFixed(0);

              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-medium">
                      {item.value} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
