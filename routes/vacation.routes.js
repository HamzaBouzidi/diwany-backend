import express from 'express';
import { addVacation, getAllVacations, getVacationCountsByState, getVacationsByEmployee, getVacationsByManager, validateVacation } from '../controllers/vacation.controller.js';

const router = express.Router();

router.post('/vacations/add', addVacation);
// Route to get vacations by manager
router.get('/vacations/manager/:manager_rw', getVacationsByManager);
router.get('/vacations/get-all', getAllVacations);
router.get('/vacations/vacation-counts', getVacationCountsByState);
router.put('/vacations/:id/validate', validateVacation);
router.get('/vacations/:employee_rw', getVacationsByEmployee);












export default router;
