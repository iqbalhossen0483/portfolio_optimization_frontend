import { z } from "zod";

export const trainingSchema = z.object({
  portfolioModel: z.enum(["A", "B", "C"]),
  topology: z.enum(["cooperative", "competitive", "mixed", "all"]),
  trainStart: z.string().optional(),
  trainEnd: z.string().optional(),
  valStart: z.string().optional(),
  valEnd: z.string().optional(),
  alpha1: z.number().min(0).max(1),
  alpha2: z.number().min(0).max(1),
  alpha3: z.number().min(0).max(0.1),
  beta: z.number().min(0).max(1),
  lam: z.number().min(0).max(1),
});

export type TrainingSchema = z.infer<typeof trainingSchema>;
