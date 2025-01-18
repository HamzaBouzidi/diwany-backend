import express from 'express';
import {
 getNominationFormVisibility,
 updateNominationFormVisibility,
 checkNominationFormVisibility,
} from '../controllers/nominationFormVisibility.controller.js';

const router = express.Router();

// Get the current visibility state
router.get('/nomination-form-visibility', getNominationFormVisibility);

// Update the visibility state
router.post('/nomination-form-visibility', updateNominationFormVisibility);

// Protected route for the nomination form
router.get('/nomination-form', checkNominationFormVisibility, (req, res) => {
 res.status(200).json({ message: 'Welcome to the nomination form!' });
});

export default router;
