import { Router } from 'express';
import { getGeneralStatsController, getMontlyStatsController, getYearlyStatsController } from '../controller/stats';


const router = Router();

router.get('/general', getGeneralStatsController);
router.get('/monthly', getMontlyStatsController);
router.get('/yearly', getYearlyStatsController);

export default router;
