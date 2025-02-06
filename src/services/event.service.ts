import { EventRepository } from '../repositories/event.repository';
import { CreateEventDTO, UpdateEventDTO, EventQueryDTO } from '../types/dto';
import { Event } from '../types/models';
import { ApiError } from '../utils/ApiError';

export class EventService {
  static async createEvent(data: CreateEventDTO & { creatorId: number }): Promise<Event> {
    return await EventRepository.createEvent(data);
  }

  static async getEventById(id: number): Promise<Event> {
    const event = await EventRepository.findEventById(id);
    if (!event) {
      throw ApiError.notFound('Event not found');
    }
    return event;
  }

  static async getEvents(query: EventQueryDTO): Promise<{
    events: Event[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { events, total } = await EventRepository.findEvents(query);
    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      events,
      total,
      page,
      limit,
      totalPages,
    };
  }

  static async updateEvent(
    id: number,
    userId: number,
    data: UpdateEventDTO
  ): Promise<Event> {
    const event = await EventRepository.findEventById(id);
    if (!event) {
      throw ApiError.notFound('Event not found');
    }

    if (event.creatorId !== userId) {
      throw ApiError.forbidden('Only the event creator can update the event');
    }

    const updatedEvent = await EventRepository.updateEvent(id, data);
    if (!updatedEvent) {
      throw ApiError.internal('Failed to update event');
    }

    return updatedEvent;
  }

  static async deleteEvent(id: number, userId: number): Promise<void> {
    const event = await EventRepository.findEventById(id);
    if (!event) {
      throw ApiError.notFound('Event not found');
    }

    if (event.creatorId !== userId) {
      throw ApiError.forbidden('Only the event creator can delete the event');
    }

    await EventRepository.deleteEvent(id);
  }

  static async joinEvent(eventId: number, userId: number): Promise<void> {
    const event = await EventRepository.findEventById(eventId);
    if (!event) {
      throw ApiError.notFound('Event not found');
    }

    if (event.creatorId === userId) {
      throw ApiError.badRequest('Event creator cannot join their own event');
    }

    if (event.eventDate < new Date()) {
      throw ApiError.badRequest('Cannot join past events');
    }

    await EventRepository.joinEvent(eventId, userId);
  }

  static async leaveEvent(eventId: number, userId: number): Promise<void> {
    const event = await EventRepository.findEventById(eventId);
    if (!event) {
      throw ApiError.notFound('Event not found');
    }

    if (event.creatorId === userId) {
      throw ApiError.badRequest('Event creator cannot leave their own event');
    }

    await EventRepository.leaveEvent(eventId, userId);
  }

  static async getEventParticipants(
    eventId: number,
    page = 1,
    limit = 10
  ): Promise<{
    participants: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const event = await EventRepository.findEventById(eventId);
    if (!event) {
      throw ApiError.notFound('Event not found');
    }

    const { participants, total } = await EventRepository.getEventParticipants(
      eventId,
      page,
      limit
    );

    const totalPages = Math.ceil(total / limit);

    return {
      participants,
      total,
      page,
      limit,
      totalPages,
    };
  }
} 