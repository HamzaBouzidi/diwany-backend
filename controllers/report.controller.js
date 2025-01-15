import Report from '../models/report.js';

export const addReport = async (req, res) => {
 const {
  name,
  jobTitle,
  nationalNumber,
  department,
  startDate,
  endDate
 } = req.body;

 try {
  // Validate that required fields are present
  if (!name || !jobTitle || !nationalNumber || !department || !startDate || !endDate) {
   return res.status(400).json({ message: 'All required fields must be filled' });
  }

  // Check if a report with the same nationalNumber already exists
  const existingReport = await Report.findOne({ where: { nationalNumber } });
  if (existingReport) {
   return res.status(400).json({ message: 'A report with this national number already exists' });
  }

  // Create a new report
  const newReport = await Report.create({
   name,
   jobTitle,
   nationalNumber,
   department,
   startDate,
   endDate
  });

  // Respond with the newly created report
  return res.status(201).json({
   message: 'Report added successfully',
   report: newReport
  });

 } catch (error) {
  console.error('Error adding report:', error);
  return res.status(500).json({ message: 'Internal server error', error: error.message });
 }
};