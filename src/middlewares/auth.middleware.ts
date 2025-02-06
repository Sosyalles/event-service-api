import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Event } from '../models';
import { userService } from '../services/user.service';
import { ApiError } from '../utils/ApiError';
import { Config } from '../config/config';

interface JwtPayload {
  userId: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        roles?: string[];
        isActive?: boolean;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw ApiError.unauthorized('No authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('No token provided');
    }

    try {
      // First verify the token structure
      const decoded = jwt.verify(
        token,
        Config.JWT_SECRET
      ) as JwtPayload;

      // Then validate the token with user service
      const userData = await userService.validateToken(token);
      
      req.user = {
        id: userData.id,
        email: userData.email,
        roles: userData.roles,
        isActive: userData.isActive
      };

      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.JsonWebTokenError) {
        throw ApiError.unauthorized('Invalid token');
      }
      throw jwtError;
    }
  } catch (error) {
    next(error);
  }
};

export const isEventCreator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const userId = req.user?.id;

    if (!userId) {
      throw ApiError.unauthorized('User not authenticated');
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      throw ApiError.notFound('Event not found');
    }

    if (event.creatorId !== userId) {
      throw ApiError.forbidden('User is not the event creator');
    }

    next();
  } catch (error) {
    next(error);
  }
}; 