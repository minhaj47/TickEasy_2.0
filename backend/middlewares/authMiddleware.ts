import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/organization';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
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
    req.orgInfo = decoded;
    next();
  } catch (error) {
    console.error('Error in verifyToken:', error);
    return res.status(401).json({
      message: 'Invalid token',
    });
  }
};
