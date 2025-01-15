import express from 'express';
import { addCin, getAllCins, updateCinState } from '../controllers/cin.controller.js';

const router = express.Router();


router.post('/cin/add', addCin);
router.get('/cin/cin-list', getAllCins);
router.put('/cin/update-state/:CIN_ID', updateCinState);


export default router;
