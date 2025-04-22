import { Router } from 'express';
import {
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  addGroupMember,
  removeGroupMember,
  getGroupMembers,
} from '../controllers/groupController';

const router = Router();

router.get('/', getGroups);
router.get('/:id', getGroupById);
router.post('/', createGroup);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);

// Group member management
router.get('/:id/members', getGroupMembers);
router.post('/:id/members', addGroupMember);
router.delete('/:id/members/:userId', removeGroupMember);

export default router;
