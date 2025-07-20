import { Request, Response } from 'express';
import prisma from '../prismaClient';
import { OrgDTO, OrgResponse, UserDTO, UserResponse } from '../types/user';

export class UserOrgController {
  static async getUser(req: Request, res: Response<UserResponse>) {
    try {
      const { id } = req.params;

      // Validate that id is provided
      if (!id) {
        return res.status(400).json({
          message: 'User ID is required',
          error: 'Missing user ID parameter',
        });
      }

      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          tickets: {
            include: {
              event: {
                include: {
                  organization: true, // Include organization for EventDTO
                  _count: {
                    select: { tickets: true }, // Get ticket count for EventDTO
                  },
                },
              },
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
          error: 'User not found',
        });
      }

      // Transform the user data to match UserDTO structure
      const userDTO: UserDTO = {
        id: user.id,
        email: user.email,
        tickets: user.tickets.map((ticket) => ({
          id: ticket.id,
          identifier: ticket.identifier,
          buyerName: ticket.buyerName,
          buyerEmail: ticket.buyerEmail,
          buyerPhone: ticket.buyerPhone,
          paymentMethod: ticket.paymentMethod,
          paymentId: ticket.paymentId,
          paymentStatus: ticket.paymentStatus,
          qrCode: ticket.qrCode,
          checkedIn: ticket.checkedIn,
          event: {
            id: ticket.event.id,
            title: ticket.event.title,
            category: ticket.event.category,
            description: ticket.event.description,
            imageUrl: ticket.event.imageUrl,
            location: ticket.event.location ?? undefined,
            ticketPrice: ticket.event.ticketPrice ?? undefined,
            startTime: ticket.event.startTime,
            endTime: ticket.event.endTime,
            maxTickets: ticket.event.maxTickets,
            isPublic: ticket.event.isPublic,
            organization: ticket.event.organization,
            ticketCount: ticket.event._count.tickets,
            createdAt: ticket.event.createdAt,
            updatedAt: ticket.event.updatedAt,
          },
          createdAt: ticket.createdAt,
        })),
        createdAt: user.createdAt,
      };

      // Return the userDTO, not the raw user object
      return res.status(200).json({
        user: userDTO,
        message: 'User found successfully',
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({
        message: 'Internal server error',
        error: 'Failed to retrieve user',
      });
    }
  }

  static async getOrganization(req: Request, res: Response<OrgResponse>) {
    try {
      const { id } = req.params;

      // Validate that id is provided
      if (!id) {
        return res.status(400).json({
          message: 'Organization ID is required',
          error: 'Missing organization ID parameter',
        });
      }

      const organization = await prisma.organization.findUnique({
        where: { id },
        include: {
          events: {
            include: {
              _count: {
                select: { tickets: true }, // Get ticket count for EventDetails
              },
            },
          },
        },
      });

      if (!organization) {
        return res.status(404).json({
          message: 'Organization not found',
          error: 'Organization not found',
        });
      }

      // Transform the organization data to match OrgDTO structure
      const orgDTO: OrgDTO = {
        id: organization.id,
        name: organization.name,
        email: organization.email,
        phone: organization.phone,
        address: organization.address,
        websiteUrl: organization.websiteUrl,
        logoUrl: organization.logoUrl,
        events: organization.events.map((event) => ({
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
          ticketCount: event._count.tickets,
        })),
      };

      // Return the orgDTO
      return res.status(200).json({
        org: orgDTO,
        message: 'Organization found successfully',
      });
    } catch (error) {
      console.error('Error fetching organization:', error);
      return res.status(500).json({
        message: 'Internal server error',
        error: 'Failed to retrieve organization',
      });
    }
  }
}
