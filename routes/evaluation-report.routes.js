import express from 'express';
import { addEvaluationReport, getAllEvaluationReports } from '../controllers/evaluation-report.controller.js';

const router = express.Router();

// Route to add an evaluation report
router.post('/evaluation-report/add', addEvaluationReport);
router.get('/evaluation-report/eval-list', getAllEvaluationReports);


export default router;
