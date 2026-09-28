import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { competitionParamsSchema } from '../validators/competition.validator';
import { getCompetitionDetails, getWinners } from '../services/competition.service';
import { AuthenticatedRequest } from '../types';

export const getCompetition = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    const { competitionId } = competitionParamsSchema.parse(req.params);
    const result = await getCompetitionDetails(competitionId, req.user?.id);
    sendSuccess(res, 200, result);
  }
);

export const getCompetitionWinners = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    const { competitionId } = competitionParamsSchema.parse(req.params);
    const result = await getWinners(competitionId);
    sendSuccess(res, 200, result);
  }
);