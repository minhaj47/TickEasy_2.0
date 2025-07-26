import express from 'express';
import { TicketController } from '../controllers/ticketController';
import { protect } from '../middlewares/authMiddleware';
const router = express.Router();

router.post('/verify', protect, TicketController.verifyTicket);
router.post('/checkin', protect, TicketController.checkInTicket);
router.post('/:eventId', TicketController.createTicket);
router.get('/:id', TicketController.getTicketById);

export default router;
