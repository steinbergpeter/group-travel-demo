import { Router } from 'express';
import {
  getItineraries,
  getItineraryById,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  generateItinerary,
  voteOnItinerary,
  commentOnItinerary,
} from '../controllers/itineraryController';

const router = Router();

router.get('/', getItineraries);
router.get('/:id', getItineraryById);
router.post('/', createItinerary);
router.put('/:id', updateItinerary);
router.delete('/:id', deleteItinerary);

// AI-assisted itinerary generation
router.post('/generate', generateItinerary);

// Voting and commenting
router.post('/:id/votes', voteOnItinerary);
router.post('/:id/comments', commentOnItinerary);

export default router;
