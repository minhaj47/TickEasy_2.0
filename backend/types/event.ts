import { EventCategory } from '@prisma/client';

export interface CreateEventBody {
  title: string;
  category: EventCategory;
  description: string;
  imageUrl: string;
  location?: string;
  ticketPrice?: number;
  startTime: Date;
  endTime: Date;
  maxTickets: number;
  isPublic?: boolean;
  organizationId: string;
}

export interface EventDetails {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: EventCategory;
  startTime: Date;
  endTime: Date;
  location?: string;
  ticketPrice?: number;
  maxTickets: number;
  isPublic: boolean;
  ticketCount: number;
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  websiteUrl: string;
  logoUrl: string;
}

export interface EventDTO extends EventDetails {
  organization: Organization;
}

export interface EventResponse {
  success: boolean;
  message: string;
  event?: EventDTO;
  events?: EventDTO[];
  error?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
