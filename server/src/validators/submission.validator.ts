import { z } from 'zod';

export const submissionBodySchema = z.object({
  submissionUrl: z
    .string()
    .trim()
    .url({ message: 'submissionUrl must be a valid URL.' })
    .max(2048),
});

export type SubmissionBodyInput = z.infer<typeof submissionBodySchema>;