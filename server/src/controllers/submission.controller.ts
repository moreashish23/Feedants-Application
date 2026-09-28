import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { competitionParamsSchema } from '../validators/competition.validator';
import { submissionBodySchema } from '../validators/submission.validator';
import { submitForCompetition } from '../services/submission.service';
import { AuthenticatedRequest } from '../types';
import { ApiError } from '../utils/ApiError';

export const postSubmission = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw ApiError.unauthorized('AUTH_TOKEN_MISSING', 'Authentication token is required.');
    }

    const { competitionId } = competitionParamsSchema.parse(req.params);
    const { submissionUrl } = submissionBodySchema.parse(req.body ?? {});

    const registration = await submitForCompetition(competitionId, req.user.id, submissionUrl);

    sendSuccess(res, 200, {
      submissionStatus: registration.submissionStatus,
      submissionUrl: registration.submissionUrl,
      submittedAt: registration.submittedAt,
    });
  }
);