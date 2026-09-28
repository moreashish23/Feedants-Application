import { Router } from 'express';
import { getCompetition, getCompetitionWinners } from '../controllers/competition.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/:competitionId', optionalAuth, getCompetition);
router.get('/:competitionId/winners', getCompetitionWinners);

export default router;