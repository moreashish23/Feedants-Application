import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middleware/auth.middleware';
import { postRegistration } from '../controllers/registration.controller';
import { postSubmission } from '../controllers/submission.controller';

const router = Router();

const registerLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/:competitionId/register', registerLimiter, requireAuth, postRegistration);
router.post('/:competitionId/submission', requireAuth, postSubmission);

export default router;