"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  ImagePlus,
  Send,
  Clock,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { createPostSchema, Platform } from "@/lib/validations/post";
import { usePostStore } from "@/store/post-store";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

const platforms: { value: Platform; label: string; icon: React.ElementType; color: string }[] = [
  { value: "TWITTER", label: "Twitter/X", icon: Twitter, color: "bg-sky-500" },
  { value: "FACEBOOK", label: "Facebook", icon: Facebook, color: "bg-blue-600" },
  { value: "LINKEDIN", label: "LinkedIn", icon: Linkedin, color: "bg-blue-700" },
  { value: "INSTAGRAM", label: "Instagram", icon: Instagram, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
];

export function CreatePostForm() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledTime, setScheduledTime] = useState("12:00");
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const { addPost } = usePostStore();
  const { createPostDialogOpen, setCreatePostDialogOpen } = useUIStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<any>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
      platforms: [],
      mediaUrls: [],
    },
  });

  const content = watch("content");
  const charCount = content?.length || 0;
  const maxChars = 2200;

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setMediaFiles((prev) => [...prev, data.url]);
      toast.success("Image uploaded successfully!");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      let scheduledAt: string | undefined;

      if (isScheduled && scheduledDate) {
        const [hours, minutes] = scheduledTime.split(":").map(Number);
        const date = new Date(scheduledDate);
        date.setHours(hours, minutes, 0, 0);
        scheduledAt = date.toISOString();
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: data.content as string,
          platforms: selectedPlatforms,
          scheduledAt,
          mediaUrls: mediaFiles,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create post");
      }

      const post = await res.json();
      addPost(post);

      toast.success(
        isScheduled ? "Post scheduled successfully!" : "Post saved as draft!"
      );

      // Reset form
      reset();
      setSelectedPlatforms([]);
      setIsScheduled(false);
      setScheduledDate(undefined);
      setMediaFiles([]);
      setCreatePostDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create post"
      );
    }
  };

  return (
    <Dialog open={createPostDialogOpen} onOpenChange={setCreatePostDialogOpen}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenSquareIcon className="h-5 w-5" />
            Create New Post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Platform Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Platforms</Label>
            <div className="flex flex-wrap gap-3">
              {platforms.map(({ value, label, icon: Icon, color }) => {
                const isSelected = selectedPlatforms.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => togglePlatform(value)}
                    className={cn(
                      "flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-medium transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted hover:border-primary/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                    {isSelected && (
                      <span className="ml-1 text-xs font-bold">x</span>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedPlatforms.length === 0 && (
              <p className="text-xs text-destructive">
                Select at least one platform
              </p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Post Content</Label>
            <Textarea
              id="content"
              placeholder="What's on your mind? Write your post here..."
              className="min-h-[150px] resize-none"
              {...register("content")}
            />
            <div className="flex justify-between">
              {errors.content && (
                <p className="text-xs text-destructive">
                  {errors.content.message as string}
                </p>
              )}
              <p
                className={cn(
                  "ml-auto text-xs",
                  charCount > maxChars
                    ? "text-destructive"
                    : charCount > maxChars * 0.9
                    ? "text-yellow-500"
                    : "text-muted-foreground"
                )}
              >
                {charCount}/{maxChars}
              </p>
            </div>
          </div>

          {/* Media Upload */}
          <div className="space-y-2">
            <Label>Media</Label>
            <div className="flex flex-wrap gap-3">
              {mediaFiles.map((url, index) => (
                <div
                  key={index}
                  className="relative h-20 w-20 overflow-hidden rounded-lg border"
                >
                  <img
                    src={url}
                    alt={`Media ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="absolute right-1 top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed hover:border-primary/50">
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <ImagePlus className="h-6 w-6 text-muted-foreground" />
                )}
                <input
                  type="file"
                  accept="image/*,video/mp4"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Schedule Toggle */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Switch
                checked={isScheduled}
                onCheckedChange={setIsScheduled}
              />
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Schedule for later
              </Label>
            </div>

            {isScheduled && (
              <div className="flex gap-3">
                <Input
                  type="date"
                  value={scheduledDate ? scheduledDate.toISOString().split("T")[0] : ""}
                  onChange={(e) =>
                    setScheduledDate(e.target.value ? new Date(e.target.value) : undefined)
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="w-[200px]"
                />

                <Input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-[140px]"
                />
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || selectedPlatforms.length === 0}
              className="flex-1"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isScheduled ? (
                <Clock className="mr-2 h-4 w-4" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {isScheduled ? "Schedule Post" : "Save as Draft"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PenSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return <PenSquare {...props} />;
}

import { PenSquare } from "lucide-react";
