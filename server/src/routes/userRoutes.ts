import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserPreferences,
  updateUserPreferences,
} from '../controllers/userController';

const router = Router();

// User routes
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// User preferences routes
router.get('/:id/preferences', getUserPreferences);
router.put('/:id/preferences', updateUserPreferences);

export default router;
