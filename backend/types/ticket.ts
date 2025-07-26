import { PaymentStatus } from '@prisma/client';
import { EventDTO } from './event';

export interface CreateTicketBody {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  paymentMethod: string;
  paymentId: string;
  isMale: boolean;
  isSustian: boolean;
  userId?: string;
}

export interface TicketResponse {
  success: boolean;
  message?: string;
  error?: string;
  ticketId?: string;
  ticket?: TicketDTO;
  tickets?: TicketDTO[];
  checkedIn?: boolean;
}

export interface TicketDTO extends CreateTicketBody {
  id: string;
  identifier: string;
  paymentStatus: PaymentStatus;
  qrCode: string;
  checkedIn: boolean;
  event: EventDTO;
  createdAt: Date;
}

export interface CheckInPayload {
  ticketIdentifier: string;
  qrCode?: string;
  organizationId: string;
}
