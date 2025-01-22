import { getEmployeeListByManager, getUserManager } from '../helpers/userHelper.js';
import ExitAuthorization from '../models/ExitAuthorization.js';
import { Op } from 'sequelize';

export const addExitAuthorisation = async (req, res) => {
 const {
  employee_rw,
  name,
  day,
  exitStartTime,
  returnTime,
  exitDescription,
 } = req.body;

 try {
  // Validate required fields
  if (!employee_rw || !name || !day || !exitStartTime || !returnTime) {
   return res.status(400).json({
    message: 'employee_rw, name, day, exitStartTime, and returnTime are required.',
   });
  }


  const manager_rw = await getUserManager(employee_rw);

  // Create a new exit authorization
  const newExit = await ExitAuthorization.create({
   employee_rw,
   name,
   day,
   exitStartTime,
   returnTime,
   exitDescription,
   bossApprovalStatus: 'Pending',
   bossComment: null,
   boss_rw: manager_rw,
   bossApprovalDate: null,
  });

  // Return the newly created exit authorization
  return res.status(201).json({
   message: 'Exit authorization created successfully.',
   exitAuthorization: newExit,
  });

 } catch (error) {
  console.error('Error creating exit authorization:', error);
  return res.status(500).json({ message: 'Internal server error', error: error.message });
 }
};


export const getExitAuthorizationsByManager = async (req, res) => {
 const { manager_rw } = req.params; // Manager's rw from URL parameter

 try {
  // Get the list of employee rw values managed by the manager
  const employeeRws = await getEmployeeListByManager(manager_rw);

  // Fetch exit authorizations for each employee under this manager
  const exitAuthorizations = await ExitAuthorization.findAll({
   where: {
    employee_rw: employeeRws,
   },
  });

  // If none are found
  if (!exitAuthorizations || exitAuthorizations.length === 0) {
   return res.status(200).json({
    message: 'No exit authorizations found for the given manager',
    exitAuthorizations: [],
   });
  }

  // Return the list of exit authorizations
  return res.status(200).json({
   message: 'Exit authorizations retrieved successfully',
   exitAuthorizations,
  });
 } catch (error) {
  console.error('Error fetching exit authorizations by manager:', error);
  return res.status(500).json({ message: 'Internal server error', error: error.message });
 }
};

export const getExitAuthorizationsByEmployee = async (req, res) => {
 const { employee_rw } = req.params; // Employee's rw from URL parameter

 try {
  // Validate that employee_rw is provided
  if (!employee_rw) {
   return res.status(400).json({ message: 'Employee RW is required.' });
  }

  // Fetch exit authorizations for the given employee_rw
  const exitAuthorizations = await ExitAuthorization.findAll({
   where: { employee_rw },
  });

  // Check if any exit authorizations exist for the given employee_rw
  if (exitAuthorizations.length === 0) {
   return res.status(404).json({
    message: 'No exit authorizations found for the provided Employee RW.',
   });
  }

  // Return the exit authorizations
  return res.status(200).json({ exitAuthorizations });
 } catch (error) {
  console.error('Error fetching exit authorizations:', error);
  return res.status(500).json({ message: 'Internal server error.' });
 }
};

export const validateExitAuthorization = async (req, res) => {
 const { id } = req.params;           
 const { state, comment } = req.body; 

 try {
  // Check if ID and state are provided
  if (!id || !state) {
   return res.status(400).json({
    message: 'Exit authorization ID and state are required.'
   });
  }

  // Ensure the state is valid
  const validStates = ['Approved', 'Rejected'];
  if (!validStates.includes(state)) {
   return res.status(400).json({
    message: `State must be one of: ${validStates.join(', ')}.`
   });
  }

  // Find the exit authorization by ID
  const exitAuth = await ExitAuthorization.findByPk(id);

  if (!exitAuth) {
   return res.status(404).json({
    message: 'Exit authorization request not found.'
   });
  }

  // Update the exit authorization fields
  exitAuth.bossApprovalStatus = state;
  exitAuth.bossComment = (state === 'Rejected') ? (comment || 'No comment provided.') : null;
  exitAuth.bossApprovalDate = new Date(); // The current date/time for the update

  // Save changes
  await exitAuth.save();

  return res.status(200).json({
   message: `Exit authorization has been ${state.toLowerCase()}.`,
   exitAuthorization: exitAuth
  });

 } catch (error) {
  console.error('Error validating exit authorization:', error);
  return res.status(500).json({ message: 'Internal server error.', error: error.message });
 }
};

export const getAllExitAuthorizations = async (req, res) => {
 try {
  const exitAuthorizations = await ExitAuthorization.findAll();
  return res.status(200).json({
   message: 'All exit authorizations retrieved successfully',
   exitAuthorizations,
  });
 } catch (error) {
  console.error('Error fetching exit authorizations:', error);
  return res.status(500).json({ message: 'Internal server error' });
 }
};

// Function to get exit authorization counts by approval status
export const getExitCountsByState = async (req, res) => {
 try {
  const exits = await ExitAuthorization.findAll(); // Fetch all exit authorizations

  // Initialize counters
  let pendingCount = 0;
  let refusedCount = 0;
  let approvedCount = 0;

  // Count by bossApprovalStatus
  exits.forEach(exit => {
   if (exit.bossApprovalStatus === 'Refused') {
    refusedCount++;
   } else if (exit.bossApprovalStatus === 'Approved') {
    approvedCount++;
   } else {
    pendingCount++;
   }
  });

  // Return the counts in JSON format
  res.json({
   pending: pendingCount,
   refused: refusedCount,
   approved: approvedCount,
  });
 } catch (error) {
  console.error('Error fetching exit authorizations data:', error);
  res.status(500).json({ error: 'Internal server error' });
 }
};