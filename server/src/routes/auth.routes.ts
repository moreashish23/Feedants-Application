import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { postDemoAuth } from '../controllers/auth.controller';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/demo', authLimiter, postDemoAuth);

export default router;