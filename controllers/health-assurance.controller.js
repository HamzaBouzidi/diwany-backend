import { upload } from '../helpers/fileUploadHelper.js';
import HealthAssurance from '../models/health-assurance.js';

export const createHealthAssurance = async (req, res) => {
 try {
  console.log('Request Body:', req.body);
  console.log('Uploaded Files:', req.files);
  const {
   name,
   father_name,
   grandfather_name,
   family_last_name,
   administration,
   mother_name,
   mother_last_name,
   family_members_list,
   employee_rw,
  } = req.body;

  const birthCertificateFile = req.files?.birth_certificate?.[0]?.path || null;
  const familyStateCertificateFile = req.files?.family_state_certificate?.[0]?.path || null;

  // Validate required fields
  if (
   !name ||
   !father_name ||
   !grandfather_name ||
   !family_last_name ||
   !administration ||
   !mother_name ||
   !mother_last_name ||
   !family_members_list ||
   !employee_rw
  ) {
   return res.status(400).json({ message: 'All required fields must be filled' });
  }

  // Create the health assurance request
  const newRequest = await HealthAssurance.create({
   employee_rw,
   name,
   father_name,
   grandfather_name,
   family_last_name,
   administration,
   mother_name,
   mother_last_name,
   family_members_list,
   birth_certificate: birthCertificateFile,
   family_state_certificate: familyStateCertificateFile,
  });

  res.status(201).json({ message: 'Health assurance request created successfully', healthAssurance: newRequest });
 } catch (error) {
  console.error('Error creating health assurance request:', error);
  res.status(500).json({ message: 'Internal server error', error: error.message });
 }
};


export const getAllHealthAssurances = async (req, res) => {
 try {
  const healthAssurances = await HealthAssurance.findAll();
  res.status(200).json(healthAssurances);
 } catch (error) {
  console.error('Error fetching health assurance requests:', error);
  res.status(500).json({ message: 'Internal server error', error: error.message });
 }
};


export const updateHealthAssuranceState = async (req, res) => {
 try {
  const { id } = req.params;
  const { state } = req.body;

  // Validate state input
  const validStates = ['Pending', 'Approved', 'Rejected'];
  if (!validStates.includes(state)) {
   return res.status(400).json({
    message: `Invalid state. Allowed states are: ${validStates.join(', ')}`,
   });
  }

  // Find the health assurance request
  const healthAssurance = await HealthAssurance.findByPk(id);
  if (!healthAssurance) {
   return res.status(404).json({ message: 'Health assurance request not found' });
  }

  // Update the state
  healthAssurance.state = state;

  // Save changes
  await healthAssurance.save();

  res.status(200).json({
   message: `Health assurance request has been ${state.toLowerCase()}.`,
   healthAssurance,
  });
 } catch (error) {
  console.error('Error updating health assurance state:', error);
  res.status(500).json({ message: 'Internal server error', error: error.message });
 }
};