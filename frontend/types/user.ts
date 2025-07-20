import { EventDetails } from "./event";
import { TicketDTO } from "./ticket";

export interface UserDTO {
  id: string;
  email: string;
  tickets: TicketDTO[];
  createdAt: Date;
}

export interface UserResponse {
  user?: UserDTO;
  message: string;
  error?: string;
}

export interface OrgDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  websiteUrl: string;
  logoUrl: string;
  events: EventDetails[];
}

export interface OrgResponse {
  org?: OrgDTO;
  message: string;
  error?: string;
}
