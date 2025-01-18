import express from 'express';
import { addReport, getAllReports } from '../controllers/report.controller.js';

const router = express.Router();

router.post('/working-period-report/add', addReport);


router.get('/working-period-report/all', getAllReports);






export default router;
