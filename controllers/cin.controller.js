import Cin from '../models/cin.js';  // Ensure this is the correct path to the Cin model

// Function to add a new CIN entry
export const addCin = async (req, res) => {
 const {
  user_name,
  user_num,
  user_natio_num,
  user_sifa,
  user_ref_emp,
  state  // Optional if the state can be controlled by the request
 } = req.body;

 try {
  // Validate that required fields are present
  if (!user_name || !user_num || !user_natio_num || !user_sifa || !user_ref_emp) {
   return res.status(400).json({ message: 'All required fields must be filled' });
  }

  // Create a new CIN entry
  const newCin = await Cin.create({
   user_name,
   user_num,
   user_natio_num,
   user_sifa,
   user_ref_emp,
   state: state || false  // Default to false if state is not provided
  });

  // Respond with the newly created CIN entry
  return res.status(201).json({
   message: 'CIN entry created successfully',
   cin: newCin
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
export const updateCin = async (req, res) => {
 try {
  const cin = await Cin.findByPk(req.params.id);
  if (!cin) return res.status(404).json({ message: 'CIN not found' });
  await cin.update(req.body);
  res.status(200).json(cin);
 } catch (error) {
  res.status(500).json({ message: 'Error updating CIN', error });
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
