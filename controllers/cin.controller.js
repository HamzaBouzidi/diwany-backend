import Cin from '../models/cin.js';  

export const addCin = async (req, res) => {
 const { user_name, user_num, user_natio_num, user_sifa, user_ref_emp } = req.body;

 try {
  if (!user_name || !user_num || !user_natio_num || !user_sifa || !user_ref_emp) {
   return res.status(400).json({ message: 'All required fields must be filled' });
  }

  const newCin = await Cin.create({
   user_name,
   user_num,
   user_natio_num,
   user_sifa,
   user_ref_emp,
  });

  return res.status(201).json({
   message: 'CIN entry created successfully',
   cin: newCin,
  });
 } catch (error) {
  console.error('Error creating CIN entry:', error);
  return res.status(500).json({ message: 'Internal server error', error: error.message });
 }
};



// Get all CINs
export const getAllCins = async (req, res) => {
 try {
  const cins = await Cin.findAll();
  res.status(200).json(cins);
 } catch (error) {
  res.status(500).json({ message: 'Error fetching CINs', error });
 }
};



// Get a CIN by ID
export const getCinById = async (req, res) => {
 try {
  const cin = await Cin.findByPk(req.params.id);
  if (!cin) return res.status(404).json({ message: 'CIN not found' });
  res.status(200).json(cin);
 } catch (error) {
  res.status(500).json({ message: 'Error fetching CIN', error });
 }
};

// Create a new CIN
export const createCin = async (req, res) => {
 try {
  const newCin = await Cin.create(req.body);
  res.status(201).json(newCin);
 } catch (error) {
  res.status(500).json({ message: 'Error creating CIN', error });
 }
};


// Update a CIN
export const updateCinState = async (req, res) => {
 const { CIN_ID } = req.params; // CIN ID from the URL
 const { state } = req.body;   // New state from the request body

 try {
  // Validate that required parameters are present
  if (!CIN_ID || !state) {
   return res.status(400).json({
    message: 'CIN ID and state are required.',
   });
  }

  // Validate the state value
  const validStates = ['Approved', 'Rejected', 'Pending'];
  if (!validStates.includes(state)) {
   return res.status(400).json({
    message: `Invalid state. State must be one of: ${validStates.join(', ')}`,
   });
  }

  // Find the CIN entry by its ID
  const cinEntry = await Cin.findByPk(CIN_ID);

  if (!cinEntry) {
   return res.status(404).json({
    message: 'CIN entry not found.',
   });
  }

  // Update the state of the CIN entry
  cinEntry.state = state;
  await cinEntry.save();

  return res.status(200).json({
   message: `CIN entry state updated to ${state}.`,
   cin: cinEntry,
  });
 } catch (error) {
  console.error('Error updating CIN state:', error);
  return res.status(500).json({
   message: 'Internal server error.',
   error: error.message,
  });
 }
};

// Delete a CIN
export const deleteCin = async (req, res) => {
 try {
  const cin = await Cin.findByPk(req.params.id);
  if (!cin) return res.status(404).json({ message: 'CIN not found' });
  await cin.destroy();
  res.status(204).send();
 } catch (error) {
  res.status(500).json({ message: 'Error deleting CIN', error });
 }
};
