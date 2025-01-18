import express from 'express';
import { addReport, getAllReports, updateEvaluation, updateWorkPeriodState } from '../controllers/report.controller.js';

const router = express.Router();

router.post('/working-period-report/add', addReport);


router.get('/working-period-report/all', getAllReports);


//router.put('/working-period-report/:id/state', updateWorkPeriodState);

router.put('/work-periods/:id/state', updateWorkPeriodState);
router.put('/work-periods/:id/evaluation', updateEvaluation);



export default router;
