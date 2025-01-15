import Vacation from '../models/vacation.js';
import { getUserManager, getEmployeeListByManager } from '../helpers/userHelper.js';

export const addVacation = async (req, res) => {
 const { employee_rw, name, department, vacationDays, vacationStartDay, vacationEndDate, vacationDescription } = req.body;

 try {
  // Validate that all required fields are present
  if (!employee_rw || !name || !department || !vacationDays || !vacationStartDay || !vacationEndDate) {
   return res.status(400).json({ message: 'All required fields must be filled' });
  }

  // Get the manager's rw using the employee's rw
  const manager_rw = await getUserManager(employee_rw);
  console.log(manager_rw)

  // Create a new vacation request
  const newVacation = await Vacation.create({
   employee_rw,
   name,
   department,
   vacationDays,
   vacationStartDay,
   vacationEndDate,
   vacationDescription,
   bossApprovalStatus: 'Pending',  // Default approval status
   bossComment: null,  // No comment initially
   boss_rw: manager_rw,  // Set manager's rw
   bossApprovalDate: null,  // No approval date initially
  });

  // Respond with the newly created vacation
  return res.status(201).json({
   message: 'Vacation request created successfully',
   vacation: newVacation
  });
 } catch (error) {
  console.error('Error creating vacation:', error);
  return res.status(500).json({ message: 'Internal server error' });
 }
};


export const getVacationsByManager = async (req, res) => {
 const { manager_rw } = req.params; // Manager's rw from URL parameter

 try {
  // Get the list of employee rw values managed by the manager
  const employeeRws = await getEmployeeListByManager(manager_rw);

  // Fetch vacation requests for each employee
  const vacations = await Vacation.findAll({
   where: {
    employee_rw: employeeRws,
   },
  });

  // If no vacations are found (empty array or no response)
  if (!vacations || vacations.length === 0) {
   return res.status(200).json({
    message: 'No vacation requests found for the given manager',
    vacations: [],
   });
  }

  // Return the list of vacation requests
  res.status(200).json({
   message: 'Vacation requests retrieved successfully',
   vacations,
  });
 } catch (error) {
  console.error('Error fetching vacations by manager:', error);
  res.status(500).json({ message: 'Internal server error' });
 }
};


// Function to get all vacation requests
export const getAllVacations = async (req, res) => {
 try {
  const vacations = await Vacation.findAll();  // Fetch all vacations from the database
  res.status(200).json(vacations);  // Send the vacations as JSON response
 } catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Error retrieving vacations', error });
 }
};

// Function to get vacation counts by approval status
export const getVacationCountsByState = async (req, res) => {
 try {
  const vacations = await Vacation.findAll(); // Fetch all vacations

  // Initialize counters
  let inProgressCount = 0;
  let refusedCount = 0;
  let acceptedCount = 0;

  vacations.forEach(vacation => {
   if (vacation.bossApprovalStatus === 'Refused') {
    refusedCount++;
   } else if (vacation.bossApprovalStatus === 'Approved') {
    acceptedCount++;
   } else {
    inProgressCount++;
   }
  });

  // Return the counts in JSON format
  res.json({
   inProgress: inProgressCount,
   refused: refusedCount,
   accepted: acceptedCount,
  });
 } catch (error) {
  console.error('Error fetching vacation data:', error);
  res.status(500).json({ error: 'Internal server error' });
 }
};


export const validateVacation = async (req, res) => {
 const { id } = req.params; // Vacation ID from the route parameter
 const { state, comment } = req.body; // New state and optional comment

 try {
  // Validate input
  if (!id || !state) {
   return res.status(400).json({ message: 'Vacation ID and state are required.' });
  }

  // Ensure the state is valid
  const validStates = ['Approved', 'Rejected'];
  if (!validStates.includes(state)) {
   return res.status(400).json({ message: `State must be one of: ${validStates.join(', ')}.` });
  }

  // Find the vacation request by ID
  const vacation = await Vacation.findByPk(id);

  if (!vacation) {
   return res.status(404).json({ message: 'Vacation request not found.' });
  }

  // Update the vacation request
  vacation.bossApprovalStatus = state;
  vacation.bossComment = state === 'Rejected' ? comment || 'No comment provided.' : null;
  vacation.bossApprovalDate = new Date(); // Set the current date for approval/rejection

  // Save the changes to the database
  await vacation.save();

  // Respond with the updated vacation request
  return res.status(200).json({
   message: `Vacation request has been ${state.toLowerCase()}.`,
   vacation,
  });

 } catch (error) {
  console.error('Error validating vacation:', error);
  return res.status(500).json({ message: 'Internal server error.' });
 }
};
export const getVacationsByEmployee = async (req, res) => {
 const { employee_rw } = req.params;

 try {
  // Validate that employee_rw is provided
  if (!employee_rw) {
   return res.status(400).json({ message: 'Employee RW is required.' });
  }

  // Fetch vacations for the given employee_rw
  const vacations = await Vacation.findAll({
   where: { employee_rw }
  });

  // Check if vacations exist for the given employee_rw
  if (vacations.length === 0) {
   return res.status(404).json({ message: 'No vacations found for the provided Employee RW.' });
  }

  // Return the vacations
  return res.status(200).json({ vacations });
 } catch (error) {
  console.error('Error fetching vacations:', error);
  return res.status(500).json({ message: 'Internal server error.' });
 }
};