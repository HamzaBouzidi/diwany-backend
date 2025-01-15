import express from 'express';
import { addReleaseForm, getAllReleases } from '../controllers/release.controller.js';

const router = express.Router();

router.post('/release/add', addReleaseForm);
router.get('/release/release-list', getAllReleases);

export default router;
