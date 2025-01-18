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

// Update release state
export const updateReleaseState = async (req, res) => {
 try {
  const { id } = req.params; // Get release ID from the URL
  const { state } = req.body; // Get new state from the request body

  // Validate required fields
  if (!state) {
   return res.status(400).json({
    success: false,
    message: 'State is required.',
   });
  }

  // Check if the release exists
  const release = await Release.findByPk(id);
  if (!release) {
   return res.status(404).json({
    success: false,
    message: 'Release not found.',
   });
  }

  // Update the release state
  release.state = state;
  await release.save();

  // Respond with the updated release
  res.status(200).json({
   success: true,
   message: 'Release state updated successfully.',
   release,
  });
 } catch (error) {
  console.error('Error updating release state:', error);
  res.status(500).json({
   success: false,
   message: 'Failed to update release state.',
   error: error.message,
  });
 }
}
