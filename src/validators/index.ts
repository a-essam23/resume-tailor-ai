import { z } from "zod";

// validate request schema
export const jobApplicationSchema = z.object({
  title: z.string(),
  description: z.string(),
  company: z.string(),
  href: z.string(),
});

export type IJobApplication = z.infer<typeof jobApplicationSchema>;
