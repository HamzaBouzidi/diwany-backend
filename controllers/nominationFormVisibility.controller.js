import NominationFormVisibility from '../models/nominationFormVisibility.js';

// Get the current visibility state
export const getNominationFormVisibility = async (req, res) => {
 try {
  const visibility = await NominationFormVisibility.findOne({ where: {}, raw: true });
  res.status(200).json({ isVisible: visibility?.isVisible ?? false });
 } catch (error) {
  res.status(500).json({ message: 'Error fetching nomination form visibility', error });
 }
};

// Update the visibility state
export const updateNominationFormVisibility = async (req, res) => {
 try {
  const { isVisible } = req.body;

  if (typeof isVisible !== 'boolean') {
   return res.status(400).json({ message: 'Invalid visibility state provided' });
  }

  // Update or create the visibility record
  const [visibility] = await NominationFormVisibility.upsert({ id: 1, isVisible });

  res.status(200).json({
   message: 'Nomination form visibility updated successfully',
   isVisible: visibility.isVisible,
  });
 } catch (error) {
  res.status(500).json({ message: 'Error updating nomination form visibility', error });
 }
};

// Middleware to check visibility before accessing the form
export const checkNominationFormVisibility = async (req, res, next) => {
 try {
  const visibility = await NominationFormVisibility.findOne({ where: {}, raw: true });

  if (!visibility?.isVisible) {
   return res.status(403).json({ message: 'The nomination form is currently hidden' });
  }

  next();
 } catch (error) {
  res.status(500).json({ message: 'Error checking nomination form visibility', error });
 }
};
