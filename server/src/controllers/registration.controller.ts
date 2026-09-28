import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { competitionParamsSchema } from '../validators/competition.validator';
import { registerForCompetition } from '../services/registration.service';
import { AuthenticatedRequest } from '../types';
import { ApiError } from '../utils/ApiError';

export const postRegistration = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw ApiError.unauthorized('AUTH_TOKEN_MISSING', 'Authentication token is required.');
    }

    const { competitionId } = competitionParamsSchema.parse(req.params);
    const result = await registerForCompetition(competitionId, req.user.id);

    sendSuccess(res, 201, {
      registration: {
        id: result.registration._id.toString(),
        status: result.registration.status,
        registeredAt: result.registration.registeredAt,
        submissionStatus: result.registration.submissionStatus,
      },
      availability: result.availability,
    });
  }
);