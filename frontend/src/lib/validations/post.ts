import { z } from "zod";

export const platformEnum = z.enum([
  "TWITTER",
  "FACEBOOK",
  "LINKEDIN",
  "INSTAGRAM",
]);

export const postStatusEnum = z.enum([
  "DRAFT",
  "SCHEDULED",
  "PUBLISHED",
  "FAILED",
]);

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Post content is required")
    .max(2200, "Content too long (max 2200 chars)"),
  platforms: z
    .array(platformEnum)
    .min(1, "Select at least one platform"),
  scheduledAt: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return date > new Date();
      },
      { message: "Scheduled time must be in the future" }
    ),
  mediaUrls: z.array(z.string().url()).default([]),
});

export const updatePostSchema = createPostSchema.partial().extend({
  id: z.string(),
  status: postStatusEnum.optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type Platform = z.infer<typeof platformEnum>;
export type PostStatus = z.infer<typeof postStatusEnum>;
