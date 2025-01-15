import Member from '../models/member.js';


export const addMember = async (req, res) => {
 const {
  user_name,
  user_direction_nomi,
  day,
  user_cu_direction,
  start_day,
  user_dipl,
  user_exp,
  user_natio,
  user_ref_emp
 } = req.body;

 try {
  if (!user_direction_nomi || !day || !start_day) {
   return res.status(400).json({ message: 'Required fields must be filled: user_direction_nomi, day, start_day' });
  }

  const newMember = await Member.create({
   user_name,
   user_direction_nomi,
   day,
   user_cu_direction,
   start_day,
   user_dipl,
   user_exp,
   user_natio,
   user_ref_emp
  });

  return res.status(201).json({
   message: 'Member request created successfully',
   member: newMember
  });

 } catch (error) {
  if (error.name === 'SequelizeUniqueConstraintError') {
   return res.status(400).json({ message: 'user_direction_nomi must be unique' });
  }

  console.error('Error creating member request:', error);
  return res.status(500).json({ message: 'Internal server error', error: error.message });
 }
};


export const getAllMembers = async (req, res) => {
 try {
  const members = await Member.findAll();
  res.status(200).json(members);
 } catch (error) {
  res.status(500).json({ message: 'Error fetching members', error });
 }
};