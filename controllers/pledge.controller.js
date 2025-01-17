import Pledge from '../models/pledge.js';

export const addPledge = async (req, res) => {
 try {
  console.log('Request Body:', req.body); // Debug: Check request body
  console.log('Uploaded File:', req.file); // Debug: Check uploaded file

  const { employeeName, employee_rw, employeeDegree } = req.body;
  const documentLink = req.file?.path || null; // Get the uploaded file path

  // Validate required fields
  if (!employeeName || !employee_rw || !employeeDegree || !documentLink) {
   return res.status(400).json({ message: 'All required fields must be filled' });
  }

  // Create a new pledge record
  const newPledge = await Pledge.create({
   employeeName,
   employee_rw,
   employeeDegree,
   documentLink,
  });

  res.status(201).json({ message: 'Pledge created successfully', pledge: newPledge });
 } catch (error) {
  console.error('Error creating pledge:', error); // Debug: Log any errors
  res.status(500).json({ message: 'Internal server error', error: error.message });
 }
};


export const getAllPledges = async (req, res) => {
 try {
  const pledges = await Pledge.findAll(); // Fetch all pledges from the database
  res.status(200).json(pledges); // Send the pledges in the response
 } catch (error) {
  console.error('Error fetching pledges:', error);
  res.status(500).json({ message: 'Internal server error', error: error.message });
 }
};

export const updatePledgeState = async (req, res) => {
 try {
  const { id } = req.params; // Extract the pledge ID from the route parameters
  const { state } = req.body; // Extract the new state from the request body

  // Validate state input
  const validStates = ['pending', 'approved', 'rejected'];
  if (!validStates.includes(state)) {
   return res.status(400).json({
    message: `Invalid state. Allowed states are: ${validStates.join(', ')}`,
   });
  }

  // Find the pledge by its ID
  const pledge = await Pledge.findByPk(id);
  if (!pledge) {
   return res.status(404).json({ message: 'Pledge not found' });
  }

  // Update the state of the pledge
  pledge.state = state;

  // Save the updated pledge to the database
  await pledge.save();

  res.status(200).json({
   message: `Pledge has been ${state.toLowerCase()}.`,
   pledge,
  });
 } catch (error) {
  console.error('Error updating pledge state:', error);
  res.status(500).json({ message: 'Internal server error', error: error.message });
 }
};