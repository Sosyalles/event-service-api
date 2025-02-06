import { ParticipationStatus } from './models';

export interface CreateEventDTO {
  title: string;
  description: string;
  categoryId: number;
  location: string;
  eventDate: string;
  maxParticipants?: number;
}

export interface UpdateEventDTO {
  title?: string;
  description?: string;
  categoryId?: number;
  location?: string;
  eventDate?: string;
  maxParticipants?: number;
}

export interface EventResponseDTO {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  location: string;
  eventDate: Date;
  creatorId: number;
  maxParticipants?: number;
  currentParticipants: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventQueryDTO {
  page?: number;
  limit?: number;
  categoryId?: number;
  location?: string;
  startDate?: string;
  endDate?: string;
}

export interface ParticipantResponseDTO {
  userId: number;
  firstName: string;
  lastName: string;
  status: ParticipationStatus;
  joinedAt: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 