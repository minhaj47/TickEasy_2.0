import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient';
import {
  AuthResponse,
  CreateOrganizationBody,
  CreateUserBody,
  JwtPayload,
  LoginBody,
  Role,
} from '../types/organization';
//checking
// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      orgInfo?: JwtPayload;
    }
  }
}

class AuthController {
  async createUser(
    req: Request<{}, AuthResponse, CreateUserBody>,
    res: Response<AuthResponse>
  ): Promise<Response<AuthResponse>> {
    try {
      const { email, password } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          message: 'User already exists',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      await prisma.ticket.updateMany({
        where: {
          buyerEmail: newUser.email,
          userId: null,
        },
        data: {
          userId: newUser.id,
        },
      });

      return res.status(201).json({
        message: 'User created successfully and tickets linked to user',
      });
    } catch (error) {
      console.error('Error in createUser:', error);
      return res.status(500).json({
        message: 'Server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async createOrganization(
    req: Request<{}, AuthResponse, CreateOrganizationBody>,
    res: Response<AuthResponse>
  ): Promise<Response<AuthResponse>> {
    try {
      const {
        name,
        description,
        logoUrl,
        address,
        websiteUrl,
        phone,
        email,
        password,
      } = req.body;

      // Validate required fields
      if (!name || !email || !password || !phone) {
        return res.status(400).json({
          message: 'Name, email, password, and phone are required',
        });
      }

      // Check if organization already exists
      const existingOrg = await prisma.organization.findUnique({
        where: { email },
      });

      if (existingOrg) {
        return res.status(400).json({
          message: 'Organization already exists',
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create organization
      await prisma.organization.create({
        data: {
          name,
          description,
          logoUrl,
          address,
          websiteUrl,
          phone,
          email,
          password: hashedPassword,
        },
      });

      return res.status(201).json({
        message: 'Organization created successfully',
      });
    } catch (error) {
      console.error('Error in createOrganization:', error);
      return res.status(500).json({
        message: 'Server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async login(
    req: Request<{}, AuthResponse, LoginBody>,
    res: Response<AuthResponse>
  ): Promise<Response<AuthResponse>> {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required',
        });
      }

      // Find organization
      const organization = await prisma.organization.findUnique({
        where: { email },
      });

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!organization && !user) {
        return res.status(401).json({
          message: 'Invalid credentials',
        });
      }

      const dbPassword = organization?.password || user?.password || '';

      // Verify password
      const isValidPassword = await bcrypt.compare(password, dbPassword);
      if (!isValidPassword) {
        return res.status(401).json({
          message: 'Invalid credentials',
        });
      }

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET environment variable is not defined');
      }

      const payload = organization
        ? ({
            id: organization.id,
            email: organization.email,
            name: organization.name,
            role: Role.ORGANIZER,
          } as JwtPayload)
        : ({
            id: user?.id,
            email: user?.email,
            role: Role.USER,
          } as JwtPayload);

      const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

      return res.json({
        message: 'Login successful',
        token,
      });
    } catch (error) {
      console.error('Error in loginOrganization:', error);
      return res.status(500).json({
        message: 'Server error!\nTry again later',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async verifyToken(req: Request, res: Response): Promise<Response | void> {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          message: 'No token provided',
        });
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET environment variable is not defined');
      }

      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      return res.status(200).json({
        message: 'Token verified',
        decoded,
      });
    } catch (error) {
      console.error('Error in verifyToken:', error);
      return res.status(401).json({
        message: 'Invalid token',
      });
    }
  }
}

export default new AuthController();
