// Type definitions
export interface CreateOrganizationBody {
  name: string;
  description: string;
  logoUrl: string;
  address: string;
  websiteUrl: string;
  phone: string;
  email: string;
  password: string;
}

export interface CreateUserBody {
  email: string;
  password: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  ORGANIZER = 'ORGANIZER',
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  name?: string;
  role: Role;
}

export interface AuthResponse {
  message: string;
  token?: string;
  error?: string;
}
