import { Router } from 'express';
import authRoutes from './auth.routes';
import competitionRoutes from './competition.routes';
import registrationRoutes from './registration.routes';
import { sendSuccess } from '../utils/apiResponse';
import { getDbState } from '../config/database';

const router = Router();

router.get('/health', (_req, res) => {
  sendSuccess(res, 200, {
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    database: getDbState(),
  });
});

router.use('/auth', authRoutes);
router.use('/competitions', competitionRoutes);
router.use('/competitions', registrationRoutes);

export default router;