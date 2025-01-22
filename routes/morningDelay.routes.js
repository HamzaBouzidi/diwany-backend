import express from 'express';
import { addMorningDelay, getAllMorningDelays, getMorningDelayCountsByState, getMorningDelaysByEmployee, getMorningDelaysByManager, validateMorningDelay, } from '../controllers/morningDelay.controller.js';

const router = express.Router();

router.post('/morning-delay/add', addMorningDelay);



router.get('/morning-delays/manager/:manager_rw', getMorningDelaysByManager);


router.get('/morning-delays/employee/:employee_rw', getMorningDelaysByEmployee);
router.put('/morning-delays/validate/:id', validateMorningDelay);


router.get('/morning-delays', getAllMorningDelays);


router.get('/morning-delays/morning-delay-counts', getMorningDelayCountsByState);




export default router;
