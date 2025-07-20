import { EventCategory } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from '../prismaClient';
import { CreateEventBody, EventDTO, EventResponse } from '../types/event';

export default class EventController {
  static async createEvent(
    req: Request<{}, {}, CreateEventBody>,
    res: Response
  ): Promise<void> {
    try {
      const {
        title,
        category,
        description,
        imageUrl,
        location,
        ticketPrice,
        startTime,
        endTime,
        maxTickets,
        isPublic = false,
        organizationId,
      }: CreateEventBody = req.body;

      // Validate required fields
      if (
        !title ||
        !category ||
        !description ||
        !imageUrl ||
        !startTime ||
        !endTime ||
        !maxTickets
      ) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields',
        });
        return;
      }

      if (startTime >= endTime) {
        res.status(400).json({
          success: false,
          message: 'End time must be after start time',
        });
        return;
      }

      if (startTime < new Date()) {
        res.status(400).json({
          success: false,
          message: 'Event start time cannot be in the past',
        });
        return;
      }

      // Validate maxTickets
      if (maxTickets <= 0) {
        res.status(400).json({
          success: false,
          message: 'Maximum tickets must be greater than 0',
        });
        return;
      }

      // Create event
      const event = await prisma.event.create({
        data: {
          title,
          category,
          description,
          imageUrl,
          location,
          ticketPrice,
          startTime,
          endTime,
          maxTickets,
          isPublic,
          organizationId,
        },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
              websiteUrl: true,
            },
          },
          _count: {
            select: {
              tickets: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: event,
      });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Delete an event
  static async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const { organizationId } = req.body;

      // Check if event exists and belongs to user's organization
      const existingEvent = await prisma.event.findFirst({
        where: {
          id: eventId,
          organizationId,
        },
        include: {
          _count: {
            select: {
              tickets: true,
            },
          },
        },
      });

      if (!existingEvent) {
        res.status(404).json({
          success: false,
          message: 'Event not found or access denied',
        });
        return;
      }

      // Prevent deletion of events with tickets
      if (existingEvent._count.tickets > 0) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete event with existing tickets',
        });
        return;
      }

      // Delete event
      await prisma.event.delete({
        where: { id: eventId },
      });

      res.status(200).json({
        success: true,
        message: 'Event deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Get all events
  static async getEvents(
    req: Request,
    res: Response<EventResponse>
  ): Promise<void> {
    try {
      const {
        page = '1',
        limit = '10',
        category,
        organizationId,
        search,
        startDate,
        endDate,
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build filter conditions
      const where: any = {
        isPublic: true,
      };

      if (
        category &&
        Object.values(EventCategory).includes(category as EventCategory)
      ) {
        where.category = category;
      }

      if (organizationId) {
        where.organizationId = organizationId;
      }

      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      if (startDate || endDate) {
        where.startTime = {};
        if (startDate) {
          where.startTime.gte = new Date(startDate as string);
        }
        if (endDate) {
          where.startTime.lte = new Date(endDate as string);
        }
      }

      const [eventsRaw, totalCount] = await Promise.all([
        prisma.event.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { startTime: 'asc' },
          include: {
            organization: true,
            _count: {
              select: { tickets: true },
            },
          },
        }),
        prisma.event.count({ where }),
      ]);

      const events: EventDTO[] = eventsRaw.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        imageUrl: event.imageUrl,
        category: event.category,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location ?? undefined,
        ticketPrice: event.ticketPrice ?? undefined,
        maxTickets: event.maxTickets,
        isPublic: event.isPublic,
        organization: {
          id: event.organization.id,
          name: event.organization.name,
          email: event.organization.email,
          phone: event.organization.phone,
          address: event.organization.address,
          websiteUrl: event.organization.websiteUrl,
          logoUrl: event.organization.logoUrl,
        },
        ticketCount: event._count.tickets,
      }));

      const totalPages = Math.ceil(totalCount / limitNum);

      const response: EventResponse = {
        success: true,
        message: 'Events retrieved successfully',
        events,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limitNum,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching events:', error);

      const response: EventResponse = {
        success: false,
        message: 'Failed to fetch events',
        error:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : 'Internal server error',
      };

      res.status(500).json(response);
    }
  }

  // Get single event by ID
  static async getEventById(
    req: Request,
    res: Response<EventResponse>
  ): Promise<Response<EventResponse>> {
    try {
      const { eventId } = req.params;

      if (!eventId) {
        return res.status(400).json({
          success: false,
          message: 'Event ID is required',
        });
      }

      const event = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              websiteUrl: true,
              logoUrl: true,
            },
          },
          _count: {
            select: {
              tickets: true,
            },
          },
        },
      });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Event retrieved successfully',
        event: {
          ...event,
          ticketCount: event._count.tickets,
        } as EventDTO,
      });
    } catch (error) {
      console.error('Error fetching event:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch event',
        error:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : undefined,
      });
    }
  }
}
