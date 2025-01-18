import express from 'express';
import { addReleaseForm, getAllReleases, updateReleaseState } from '../controllers/release.controller.js';

const router = express.Router();

router.post('/release/add', addReleaseForm);
router.get('/release/release-list', getAllReleases);
// Update release state
router.put('/releases/:id/state', updateReleaseState);
export default router;
