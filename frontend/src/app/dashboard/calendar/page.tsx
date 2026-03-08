"use client";

import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ScheduledPost {
  id: string;
  content: string;
  platforms: string[];
  status: string;
  scheduledAt: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts?status=SCHEDULED&limit=100");
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad the start to align with weekday
  const startDay = monthStart.getDay();
  const paddedDays = Array(startDay).fill(null).concat(daysInMonth);

  const getPostsForDay = (day: Date) =>
    posts.filter(
      (post) =>
        post.scheduledAt && isSameDay(new Date(post.scheduledAt), day)
    );

  const selectedDayPosts = selectedDay ? getPostsForDay(selectedDay) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">
          View your scheduled posts on a calendar
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {format(currentDate, "MMMM yyyy")}
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
                  )
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
                  )
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Weekday Headers */}
            <div className="mb-2 grid grid-cols-7 text-center text-sm font-medium text-muted-foreground">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {paddedDays.map((day, index) => {
                if (!day) {
                  return <div key={`pad-${index}`} className="p-2" />;
                }

                const dayPosts = getPostsForDay(day);
                const isToday = isSameDay(day, new Date());
                const isSelected = selectedDay && isSameDay(day, selectedDay);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "flex min-h-[80px] flex-col items-start rounded-lg border p-2 text-left transition-colors hover:bg-muted/50",
                      isToday && "border-primary bg-primary/5",
                      isSelected && "ring-2 ring-primary"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isToday && "text-primary"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {dayPosts.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {dayPosts.slice(0, 2).map((post) => (
                          <div
                            key={post.id}
                            className="h-1.5 w-1.5 rounded-full bg-primary"
                          />
                        ))}
                        {dayPosts.length > 2 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{dayPosts.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Day Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDay
                ? format(selectedDay, "EEEE, MMM d")
                : "Select a day"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!selectedDay ? (
              <p className="text-sm text-muted-foreground">
                Click on a day to see scheduled posts
              </p>
            ) : selectedDayPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No posts scheduled for this day
              </p>
            ) : (
              selectedDayPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-lg border p-3 space-y-2"
                >
                  <p className="text-sm">
                    {post.content.substring(0, 100)}
                    {post.content.length > 100 ? "..." : ""}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {post.platforms.map((p) => (
                        <Badge key={p} variant="outline" className="text-xs">
                          {p.toLowerCase()}
                        </Badge>
                      ))}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(new Date(post.scheduledAt), "h:mm a")}
                    </span>
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
