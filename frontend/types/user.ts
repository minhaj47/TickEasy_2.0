import { TicketDTO } from './ticket';

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
