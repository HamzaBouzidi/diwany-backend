import express from 'express';
import { addExitAuthorisation, getAllExitAuthorizations, getExitAuthorizationsByEmployee, getExitAuthorizationsByManager, getExitCountsByState, validateExitAuthorization } from '../controllers/exitAuthorization.controller.js';

const router = express.Router();

router.post('/authorisation/add-exit', addExitAuthorisation);


router.get('/exit-authorizations/manager/:manager_rw', getExitAuthorizationsByManager);

router.get('/exit-authorizations/employee/:employee_rw', getExitAuthorizationsByEmployee);

router.put('/exit-authorizations/validate/:id', validateExitAuthorization);

router.get('/exit-authorizations', getAllExitAuthorizations);

router.get('/exit-authorizations/exit-counts', getExitCountsByState);


export default router;
