import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/event.service';
import { CreateEventDTO, UpdateEventDTO, EventQueryDTO } from '../types/dto';

export class EventController {
  static async createEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const eventData: CreateEventDTO = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const event = await EventService.createEvent({
        ...eventData,
        creatorId: userId,
      });

      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  }

  static async getEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const eventId = parseInt(req.params.eventId, 10);
      const event = await EventService.getEventById(eventId);
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  static async getEvents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const query: EventQueryDTO = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string, 10) : undefined,
        location: req.query.location as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const result = await EventService.getEvents(query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async updateEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const eventId = parseInt(req.params.eventId, 10);
      const userId = req.user?.id;
      const eventData: UpdateEventDTO = req.body;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const event = await EventService.updateEvent(eventId, userId, eventData);
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  static async deleteEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const eventId = parseInt(req.params.eventId, 10);
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      await EventService.deleteEvent(eventId, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async joinEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const eventId = parseInt(req.params.eventId, 10);
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      await EventService.joinEvent(eventId, userId);
      res.status(200).json({ message: 'Successfully joined the event' });
    } catch (error) {
      next(error);
    }
  }

  static async leaveEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const eventId = parseInt(req.params.eventId, 10);
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      await EventService.leaveEvent(eventId, userId);
      res.status(200).json({ message: 'Successfully left the event' });
    } catch (error) {
      next(error);
    }
  }

  static async getEventParticipants(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const eventId = parseInt(req.params.eventId, 10);
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      const result = await EventService.getEventParticipants(eventId, page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
} 