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