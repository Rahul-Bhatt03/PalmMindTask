import { z } from "zod";

export const profileSchema = z.object({
  displayName: z.string().trim().min(1, "Display name is required").max(80),
  email: z.string().trim().email("Enter a valid email"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
