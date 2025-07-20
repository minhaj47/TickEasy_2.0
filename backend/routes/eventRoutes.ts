import { Router } from 'express';
import EventController from '../controllers/eventController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.post('/create', protect, EventController.createEvent);
// router.put('/events/:eventId', protect, EventController.updateEvent);
router.delete('/delete/:eventId', protect, EventController.deleteEvent);
router.get('/all', EventController.getEvents);
router.get('/:eventId', EventController.getEventById);

export default router;
