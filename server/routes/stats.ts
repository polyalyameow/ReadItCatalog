import { Router } from 'express';
import { getGeneralStatsController, getMontlyStatsController } from '../controller/stats';


const router = Router();

router.get('/general', getGeneralStatsController);
router.get('/monthly', getMontlyStatsController);

export default router;
