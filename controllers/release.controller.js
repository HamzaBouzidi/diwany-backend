import Release from '../models/release.js';


export const addReleaseForm = async (req, res) => {
 try {
  const {
   directorName,
   directorRw,
   employeeName,
   employeeRw,
   department,
   reason,
  } = req.body;

  // Validate required fields
  if (!directorName || !directorRw || !employeeName || !employeeRw || !department || !reason) {
   return res.status(400).json({
    success: false,
    message: 'All fields are required.',
   });
  }

  // Create a new release record
  const newRelease = await Release.create({
   directorName,
   directorRw,
   employeeName,
   employeeRw,
   department,
   reason,
  });

  // Respond with the created release
  res.status(201).json({
   success: true,
   message: 'Release created successfully.',
   release: newRelease,
  });
 } catch (error) {
  console.error('Error adding release:', error);
  res.status(500).json({
   success: false,
   message: 'Failed to create release.',
   error: error.message,
  });
 }
};


// Get all Release records
export const getAllReleases = async (req, res) => {
 try {
  const releases = await Release.findAll();
  res.status(200).json(releases);
 } catch (error) {
  res.status(500).json({ message: 'Error fetching Release records', error });
 }
};
