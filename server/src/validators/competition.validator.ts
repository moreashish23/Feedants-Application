import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid competition ID.',
  });

export const competitionParamsSchema = z.object({
  competitionId: objectIdSchema,
});

export type CompetitionParamsInput = z.infer<typeof competitionParamsSchema>;