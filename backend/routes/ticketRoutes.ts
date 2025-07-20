import express from 'express';
import { TicketController } from '../controllers/ticketController';
const router = express.Router();

router.post('/:eventId', TicketController.createTicket);
router.get('/:id', TicketController.getTicketById);

export default router;
