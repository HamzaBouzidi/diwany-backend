import express from 'express';
import { createHealthAssurance, getAllHealthAssurances, updateHealthAssuranceState } from '../controllers/health-assurance.controller.js';
import { upload } from '../helpers/fileUploadHelper.js';


const router = express.Router();

// Updated route for handling health assurance creation with file uploads
router.post(
 '/health-assurance/add',
 upload.fields([
  { name: 'birth_certificate', maxCount: 1 },
  { name: 'family_state_certificate', maxCount: 1 },
 ]),
 createHealthAssurance
);
router.get('/health-assurance/list', getAllHealthAssurances);

router.put('/health-assurance/update-state/:id', updateHealthAssuranceState);



export default router;