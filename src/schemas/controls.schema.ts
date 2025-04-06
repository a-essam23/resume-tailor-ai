// control.schema.ts
import { z } from "zod";

export const AdjustmentControls = z.object({
  experience: z.object({
    maxYearsIncrease: z.number().max(0.2).default(0.1), // Max 10-20% increase
    allowTitlePromotion: z.boolean().default(false),
  }),
  skills: z.object({
    maxNewSkills: z.number().int().max(3).default(1),
    requiredMatchThreshold: z.number().min(0.5).max(1).default(0.7),
  }),
  education: z.object({
    allowDegreeEnhancement: z.boolean().default(false),
  }),
});

export type IAdjustmentControls = z.infer<typeof AdjustmentControls>;
