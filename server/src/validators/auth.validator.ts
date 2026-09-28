import { z } from 'zod';

export const demoAuthSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  email: z.string().trim().email().max(254).optional(),
});

export type DemoAuthInput = z.infer<typeof demoAuthSchema>;