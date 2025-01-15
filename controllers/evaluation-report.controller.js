import EvaluationReport from '../models/evaluation-report.js';

// Function to add a new evaluation report
export const addEvaluationReport = async (req, res) => {
 const {
  name,
  jobTitle,
  nationalNumber,
  nationality,
  department,
  section,
  startDate,
  endDate,
  jobKnowledge,
  technicalSkills,
  teamwork,
  problemSolving,
  timeManagement,
  decisionMaking,
 } = req.body;

 try {
  // Validate required fields
  if (!name || !jobTitle || !nationalNumber || !nationality || !department || !section || !startDate || !endDate) {
   return res.status(400).json({ message: 'All required fields must be filled' });
  }

  // Create a new evaluation report
  const newReport = await EvaluationReport.create({
   name,
   jobTitle,
   nationalNumber,
   nationality,
   department,
   section,
   startDate,
   endDate,
   jobKnowledge,
   technicalSkills,
   teamwork,
   problemSolving,
   timeManagement,
   decisionMaking
  });

  // Return the newly created report
  return res.status(201).json({
   message: 'Evaluation report added successfully',
   report: newReport
  });

 } catch (error) {
  console.error('Error adding evaluation report:', error);
  return res.status(500).json({ message: 'Internal server error', error: error.message });
 }
};



// Get all EvaluationReport records
export const getAllEvaluationReports = async (req, res) => {
 try {
  const reports = await EvaluationReport.findAll();
  res.status(200).json(reports);
 } catch (error) {
  res.status(500).json({ message: 'Error fetching EvaluationReport records', error });
 }
};
