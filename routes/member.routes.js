import express from 'express';
import { addMember, getAllMembers } from '../controllers/member.controller.js';


const router = express.Router();

router.post('/member/add', addMember);

router.get('/member/member-list', getAllMembers);


export default router;