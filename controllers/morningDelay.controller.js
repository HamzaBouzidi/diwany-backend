import MorningDelay from '../models/morningDelay.js';
import { Op } from 'sequelize';
import { getUserManager, getEmployeeListByManager } from '../helpers/userHelper.js';

export const addMorningDelay = async (req, res) => {
 const {
  employee_rw,
  name,
  day,
  time,
  description,
 } = req.body;

 try {
  // Validate that all required fields are present
  if (!employee_rw || !name || !day || !time) {
   return res.status(400).json({ message: 'All required fields must be filled' });
  }

  // Get the manager's rw using the employee's rw (similar to addVacation)
  const manager_rw = await getUserManager(employee_rw);

  // Create a new morning delay entry
  const newMorningDelay = await MorningDelay.create({
   employee_rw,
   name,
   day,
   time,
   description,
   // Boss approval fields
   bossApprovalStatus: 'Pending',
   bossComment: null,
   boss_rw: manager_rw,       // Set manager's rw
   bossApprovalDate: null,
  });

  // Respond with the newly created morning delay entry
  return res.status(201).json({
   message: 'Morning delay created successfully',
   morningDelay: newMorningDelay,
  });

 } catch (error) {
  console.error('Error creating morning delay:', error);
  return res.status(500).json({ message: 'Internal server error', error: error.message });
 }
};


export const getMorningDelaysByManager = async (req, res) => {
 const { manager_rw } = req.params; // Manager's rw from URL parameter

 try {
  // Get the list of employee rw values managed by the manager
  const employeeRws = await getEmployeeListByManager(manager_rw);

  // Fetch morning delay requests for each employee
  const morningDelays = await MorningDelay.findAll({
   where: {
    employee_rw: employeeRws,
   },
  });

  // If no morning delays are found
  if (!morningDelays || morningDelays.length === 0) {
   return res.status(200).json({
    message: 'No morning delay requests found for the given manager',
    morningDelays: [],
   });
  }

  // Return the list of morning delay requests
  return res.status(200).json({
   message: 'Morning delay requests retrieved successfully',
   morningDelays,
  });
 } catch (error) {
  console.error('Error fetching morning delay requests by manager:', error);
  return res.status(500).json({ message: 'Internal server error' });
 }
};

export const getMorningDelaysByEmployee = async (req, res) => {
 const { employee_rw } = req.params;

 try {
  // Validate that employee_rw is provided
  if (!employee_rw) {
   return res.status(400).json({ message: 'Employee RW is required.' });
  }

  // Fetch morning delays for the given employee_rw
  const morningDelays = await MorningDelay.findAll({
   where: { employee_rw }
  });

  // Check if morning delays exist for the given employee_rw
  if (morningDelays.length === 0) {
   return res.status(404).json({ message: 'No morning delays found for the provided Employee RW.' });
  }

  // Return the morning delays
  return res.status(200).json({ morningDelays });
 } catch (error) {
  console.error('Error fetching morning delays:', error);
  return res.status(500).json({ message: 'Internal server error.' });
 }
};

export const validateMorningDelay = async (req, res) => {
 const { id } = req.params;           // MorningDelay ID from the route parameter
 const { state, comment } = req.body; // New state and optional comment

 try {
  // Validate input
  if (!id || !state) {
   return res.status(400).json({ message: 'MorningDelay ID and state are required.' });
  }

  // Ensure the state is valid
  const validStates = ['Approved', 'Rejected'];
  if (!validStates.includes(state)) {
   return res.status(400).json({ message: `State must be one of: ${validStates.join(', ')}.` });
  }

  // Find the morning delay request by ID
  const morningDelay = await MorningDelay.findByPk(id);

  if (!morningDelay) {
   return res.status(404).json({ message: 'Morning delay request not found.' });
  }

  // Update the morning delay request
  morningDelay.bossApprovalStatus = state;
  morningDelay.bossComment = state === 'Rejected' ? comment || 'No comment provided.' : null;
  morningDelay.bossApprovalDate = new Date(); // Set current date for approval/rejection

  // Save the changes to the database
  await morningDelay.save();

  // Respond with the updated morning delay request
  return res.status(200).json({
   message: `Morning delay request has been ${state.toLowerCase()}.`,
   morningDelay
  });

 } catch (error) {
  console.error('Error validating morning delay:', error);
  return res.status(500).json({ message: 'Internal server error.' });
 }
};

export const getAllMorningDelays = async (req, res) => {
 try {
  const morningDelays = await MorningDelay.findAll();
  return res.status(200).json({
   message: 'All morning delays retrieved successfully',
   morningDelays
  });
 } catch (error) {
  console.error('Error fetching all morning delays:', error);
  return res.status(500).json({ message: 'Internal server error' });
 }
};