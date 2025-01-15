import Release from '../models/release.js';




export const addReleaseForm = async (req, res) => {
 const {
  directorName, employeeName, department, reason,
  R1_direction, R1_name, R1_date, R1_notes, R1_position,
  R2_direction, R2_name, R2_date, R2_notes, R2_position,
  R3_direction, R3_name, R3_date, R3_notes, R3_position,
  R4_direction, R4_name, R4_date, R4_notes, R4_position,
  R5_direction, R5_name, R5_date, R5_notes, R5_position,
  R6_direction, R6_name, R6_date, R6_notes, R6_position
 } = req.body;

 try {
  if (!directorName || !employeeName || !department || !reason) {
   return res.status(400).json({ message: 'All required fields must be filled' });
  }

  const newRelease = await Release.create({
   directorName, employeeName, department, reason,
   R1_direction, R1_name, R1_date, R1_notes, R1_position,
   R2_direction, R2_name, R2_date, R2_notes, R2_position,
   R3_direction, R3_name, R3_date, R3_notes, R3_position,
   R4_direction, R4_name, R4_date, R4_notes, R4_position,
   R5_direction, R5_name, R5_date, R5_notes, R5_position,
   R6_direction, R6_name, R6_date, R6_notes, R6_position
  });

  return res.status(201).json({
   message: 'Release form submitted successfully',
   release: newRelease
  });
 } catch (error) {
  console.error('Error submitting release form:', error);
  return res.status(500).json({ message: 'Internal server error', error: error.message });
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
