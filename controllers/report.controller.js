import Report from '../models/report.js';



export const addReport = async (req, res) => {
 try {
  const reportData = req.body; // Extract data from the request body

  // Create a new report in the database
  const newReport = await Report.create(reportData);

  res.status(201).json({
   success: true,
   message: 'Report added successfully',
   data: newReport,
  });
 } catch (error) {
  console.error('Error adding report:', error);

  res.status(500).json({
   success: false,
   message: 'Failed to add report',
   error: error.message,
  });
 }
};



export const getAllReports = async (req, res) => {
 try {
  // Fetch all reports from the database
  const reports = await Report.findAll();

  res.status(200).json({
   success: true,
   message: 'Reports fetched successfully',
   data: reports,
  });
 } catch (error) {
  console.error('Error fetching reports:', error);

  res.status(500).json({
   success: false,
   message: 'Failed to fetch reports',
   error: error.message,
  });
 }
};


// Update the state of a work period
export const updateWorkPeriodState = async (req, res) => {
 try {
  const { id } = req.params; // Get work period ID from the URL
  const { state } = req.body; // Get new state from the request body

  // Validate required fields
  if (!state) {
   return res.status(400).json({
    success: false,
    message: 'State is required.',
   });
  }

  // Check if the work period exists
  const workPeriod = await Report.findByPk(id);
  if (!workPeriod) {
   return res.status(404).json({
    success: false,
    message: 'Work period not found.',
   });
  }

  // Update the work period state
  workPeriod.state = state;
  await workPeriod.save();

  // Respond with the updated work period
  res.status(200).json({
   success: true,
   message: 'Work period state updated successfully.',
   data: workPeriod,
  });
 } catch (error) {
  console.error('Error updating work period state:', error);
  res.status(500).json({
   success: false,
   message: 'Failed to update work period state.',
   error: error.message,
  });
 }
};


export const updateEvaluation = async (req, res) => {
 try {
  const { id } = req.params;
  const {
   job_knowledge,
   job_mastery,
   job_communication_skills,
   job_problem_solving,
   job_time_management,
   job_decision_making,
   state,
  } = req.body;

  const workPeriod = await Report.findByPk(id);
  if (!workPeriod) {
   return res.status(404).json({ success: false, message: 'Work period not found.' });
  }

  workPeriod.job_knowledge = job_knowledge || workPeriod.job_knowledge;
  workPeriod.job_mastery = job_mastery || workPeriod.job_mastery;
  workPeriod.job_communication_skills = job_communication_skills || workPeriod.job_communication_skills;
  workPeriod.job_problem_solving = job_problem_solving || workPeriod.job_problem_solving;
  workPeriod.job_time_management = job_time_management || workPeriod.job_time_management;
  workPeriod.job_decision_making = job_decision_making || workPeriod.job_decision_making;
  workPeriod.state = state || workPeriod.state;

  await workPeriod.save();

  res.status(200).json({ success: true, message: 'Evaluation updated successfully.', data: workPeriod });
 } catch (error) {
  console.error('Error updating evaluation:', error);
  res.status(500).json({ success: false, message: 'Failed to update evaluation.', error: error.message });
 }
};

