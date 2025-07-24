import { PaymentStatus } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from '../prismaClient';
import { CreateTicketBody, TicketDTO, TicketResponse } from '../types/ticket';

export class TicketController {
  /**
   * Create a new ticket booking
   * POST /api/tickets/:eventId
   */
  static async createTicket(
    req: Request<{}, {}, CreateTicketBody>,
    res: Response<TicketResponse>
  ): Promise<Response<TicketResponse>> {
    try {
      const ticketData: CreateTicketBody = req.body;
      const { eventId } = req.params as { eventId: string };

      // Validate required fields
      const {
        buyerName,
        buyerEmail,
        buyerPhone,
        paymentMethod,
        paymentId,
        userId,
        isMale,
        isSustian,
      }: CreateTicketBody = ticketData;

      if (
        !buyerName ||
        !buyerEmail ||
        !buyerPhone ||
        !paymentMethod ||
        !paymentId ||
        !eventId
      ) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
        } as TicketResponse);
      }

      // Check if event exists and get current ticket count
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          organization: true,
          tickets: true,
        },
      });

      const existing = await prisma.ticket.findFirst({
        where: {
          buyerEmail,
          eventId,
        },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'A Ticket for this event is already booked with this email',
          error: 'A Ticket for this event is already booked with this email',
        } as TicketResponse);
      }

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found',
          error: 'Event does not exist',
        } as TicketResponse);
      }

      // Check ticket availability
      const currentTicketCount = event.tickets.length;
      if (currentTicketCount >= event.maxTickets) {
        return res.status(400).json({
          success: false,
          message: 'No tickets available',
          error: 'Event is sold out',
        } as TicketResponse);
      }

      const ticketCount = await prisma.ticket.count({
        where: { eventId },
      });

      const paddedNumber = String(ticketCount + 10).padStart(5, '0');
      const identifier = `TKT-${event.title}-${paddedNumber}`;

      // Create ticket in database
      const savedTicket = await prisma.ticket.create({
        data: {
          identifier,
          buyerName,
          buyerEmail,
          buyerPhone,
          paymentMethod,
          paymentId,
          eventId,
          isMale,
          isSustian,
          paymentStatus: PaymentStatus.PENDING,
          checkedIn: false,
          userId,
        },
        include: {
          event: {
            include: {
              organization: true,
            },
          },
        },
      });

      // Send success response
      return res.status(201).json({
        success: true,
        message: 'Ticket booked successfully',
        ticketId: savedTicket.id,
      } as TicketResponse);
    } catch (error) {
      console.error('Error creating ticket:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to book ticket',
        error: 'Internal server error',
      } as TicketResponse);
    }
  }

  /**
   * Get ticket by ID with full event and organization details
   * GET /api/tickets/:id
   */
  static async getTicketById(
    req: Request,
    res: Response<TicketResponse>
  ): Promise<Response<TicketResponse>> {
    try {
      const { id } = req.params;

      const ticket = await prisma.ticket.findUnique({
        where: { id },
        include: {
          event: {
            include: {
              organization: true,
              _count: {
                select: {
                  tickets: true,
                },
              },
            },
          },
        },
      });

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket not found',
          error: 'Ticket does not exist',
        });
      }

      // Transform to match frontend DTO structure
      const ticketDTO: TicketDTO = {
        id: ticket.id,
        identifier: ticket.identifier,
        buyerName: ticket.buyerName,
        buyerEmail: ticket.buyerEmail,
        buyerPhone: ticket.buyerPhone,
        isMale: ticket.isMale,
        isSustian: ticket.isSustian,
        paymentMethod: ticket.paymentMethod,
        paymentId: ticket.paymentId,
        paymentStatus: ticket.paymentStatus as PaymentStatus,
        qrCode: ticket.qrCode,
        checkedIn: ticket.checkedIn,
        event: {
          id: ticket.event.id,
          title: ticket.event.title,
          description: ticket.event.description,
          imageUrl: ticket.event.imageUrl,
          category: ticket.event.category,
          startTime: ticket.event.startTime,
          endTime: ticket.event.endTime,
          location: ticket.event.location || undefined,
          ticketPrice: ticket.event.ticketPrice || undefined,
          maxTickets: ticket.event.maxTickets,
          isPublic: ticket.event.isPublic,
          organization: {
            id: ticket.event.organization.id,
            name: ticket.event.organization.name,
            email: ticket.event.organization.email,
            phone: ticket.event.organization.phone,
            address: ticket.event.organization.address,
            websiteUrl: ticket.event.organization.websiteUrl,
            logoUrl: ticket.event.organization.logoUrl,
          },
          ticketCount: ticket.event._count.tickets,
        },
        createdAt: ticket.createdAt,
      };

      return res.status(200).json({
        success: true,
        message: 'Ticket retrieved successfully',
        ticket: ticketDTO,
      });
    } catch (error) {
      console.error('Error retrieving ticket:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve ticket',
        error: 'Internal server error',
      });
    }
  }

  /**
   * Get all tickets for an event
//    * GET /api/events/:eventId/tickets
//    */
  //   static async getEventTickets(
  //     req: Request,
  //     res: Response<TicketResponse>
  //   ): Promise<Response<TicketResponse>> {
  //     try {
  //       const { eventId } = req.params;

  //       const tickets = await prisma.ticket.findMany({
  //         where: { eventId },
  //         include: {
  //           event: {
  //             include: {
  //               organization: true,
  //             },
  //           },
  //         },
  //         orderBy: {
  //           createdAt: 'desc',
  //         },
  //       });

  //       return res.status(200).json({
  //         success: true,
  //         message: 'Tickets retrieved successfully',
  //         tickets: tickets.map((ticket) => ({
  //           ...ticket,
  //           paymentStatus: ticket.paymentStatus as PaymentStatus,
  //           updatedAt: ticket.createdAt,
  //           createdAt: ticket.createdAt,
  //           event: {
  //             ...ticket.event,
  //             organization: ticket.event.organization,
  //           },
  //         })),
  //       });
  //     } catch (error) {
  //       console.error('Error retrieving event tickets:', error);
  //       return res.status(500).json({
  //         success: false,
  //         message: 'Failed to retrieve tickets',
  //         error: 'Internal server error',
  //       });
  //     }
  //   }
}
