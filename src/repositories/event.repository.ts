import { Op } from 'sequelize';
import { Event, Category, EventParticipant } from '../models';
import { CreateEventDTO, UpdateEventDTO, EventQueryDTO } from '../types/dto';
import type { Event as EventType } from '../types/models';
import { ApiError } from '../utils/ApiError';
import { ParticipationStatus } from '../types/models';
import { userService } from '../services/user.service';

export class EventRepository {
  static async createEvent(data: CreateEventDTO & { creatorId: number }): Promise<EventType> {
    return await Event.create({
      ...data,
      eventDate: new Date(data.eventDate),
      currentParticipants: 0,
    });
  }

  static async findEventById(id: number): Promise<EventType | null> {
    return await Event.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
        },
      ],
    });
  }

  static async findEvents(query: EventQueryDTO): Promise<{
    events: EventType[];
    total: number;
  }> {
    const {
      page = 1,
      limit = 10,
      categoryId,
      location,
      startDate,
      endDate,
    } = query;

    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (location) {
      where.location = {
        [Op.iLike]: `%${location}%`,
      };
    }

    if (startDate || endDate) {
      where.eventDate = {};
      if (startDate) {
        where.eventDate[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.eventDate[Op.lte] = new Date(endDate);
      }
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Event.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
        },
      ],
      order: [['eventDate', 'ASC']],
      limit,
      offset,
    });

    return {
      events: rows,
      total: count,
    };
  }

  static async updateEvent(
    id: number,
    data: UpdateEventDTO
  ): Promise<EventType | null> {
    const event = await Event.findByPk(id);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    await event.update({
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      location: data.location,
      maxParticipants: data.maxParticipants,
      ...(data.eventDate && { eventDate: new Date(data.eventDate) }),
    });
    return event;
  }

  static async deleteEvent(id: number): Promise<void> {
    const event = await Event.findByPk(id);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    await event.destroy();
  }

  static async joinEvent(
    eventId: number,
    userId: number
  ): Promise<void> {
    const event = await Event.findByPk(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    if (
      event.maxParticipants &&
      event.currentParticipants >= event.maxParticipants
    ) {
      throw new ApiError(400, 'Event is full');
    }

    const existingParticipation = await EventParticipant.findOne({
      where: {
        eventId,
        userId,
      },
    });

    if (existingParticipation) {
      throw new ApiError(400, 'User is already participating in this event');
    }

    await EventParticipant.create({
      eventId,
      userId,
      status: ParticipationStatus.CONFIRMED,
    });

    await event.increment('currentParticipants');
  }

  static async leaveEvent(
    eventId: number,
    userId: number
  ): Promise<void> {
    const participation = await EventParticipant.findOne({
      where: {
        eventId,
        userId,
      },
    });

    if (!participation) {
      throw new ApiError(404, 'User is not participating in this event');
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    await participation.destroy();
    await event.decrement('currentParticipants');
  }

  static async getEventParticipants(
    eventId: number,
    page = 1,
    limit = 10
  ): Promise<{
    participants: any[];
    total: number;
  }> {
    const offset = (page - 1) * limit;

    const { count, rows } = await EventParticipant.findAndCountAll({
      where: { eventId },
      attributes: ['userId', 'status', 'createdAt'],
      limit,
      offset,
    });

    return {
      participants: rows,
      total: count,
    };
  }
} 