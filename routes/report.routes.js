import express from 'express';
import { addReport } from '../controllers/report.controller.js';

const router = express.Router();

router.post('/report/add', addReport);








export default router;
