import express from 'express';
import {
     getAccountCountByMonth, getAllUsers, getDistinctCountAgeALLEmployee,
     getUserInfo, login, register, updateUserState, getStatSpeciality,
     getStatJob,
     getDiplome,
     get_linked_department,
     getAllDepartments,
     getDirectorsByDepartment,
     getDepartmentByEmployeeName,
     getDirectorDepartmentByName,
     getDirectorByDepartment,
     getEmployeeRwByName,
} from '../controllers/user.controller.js';

const router = express.Router();

// Route for user registration
router.post('/register', register);
router.post('/login', login);
router.get('/all-users', getAllUsers);
router.put('/users/:userId/state', updateUserState);
router.get('/user-info/:user_ref_emp/', getUserInfo);
router.get('/account-count-by-month', getAccountCountByMonth);
router.get('/account-count-by-distinct', getDistinctCountAgeALLEmployee);
router.get('/account-count-by-speciality', getStatSpeciality);
router.get('/account-count-by-job', getStatJob);
router.get('/account-count-by-diplome', getDiplome);

router.get('/account-data-by-job-code', get_linked_department);

router.get('/departments-list', getAllDepartments);
router.get('/director-departements-list', getDirectorsByDepartment);
router.get('/department-by-employee-name', getDepartmentByEmployeeName);
router.get('/director-department-by-name', getDirectorDepartmentByName);
router.get('/director-by-department', getDirectorByDepartment);
router.get('/employee-rw-by-name', getEmployeeRwByName);








export default router;
