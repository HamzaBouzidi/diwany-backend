import express from 'express';
import { addCin, getAllCins } from '../controllers/cin.controller.js';

const router = express.Router();


router.post('/cin/add', addCin);
router.get('/cin/cin-list', getAllCins);


export default router;
