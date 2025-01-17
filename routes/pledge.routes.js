import express from 'express';
import { upload } from '../helpers/fileUploadHelper.js';
import { addPledge, getAllPledges, updatePledgeState } from '../controllers/pledge.controller.js';

const router = express.Router();

// Route for adding a pledge with file upload
router.post('/pledge/add', upload.single('document'), addPledge);

router.get('/pledges', getAllPledges);

router.put('/pledge/update-state/:id', updatePledgeState);


export default router;