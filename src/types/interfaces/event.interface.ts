import { BaseModel } from '@/types/interfaces/base.interface';
import { ParticipationStatus } from '@/types/enums/participation-status.enum';

export interface Event extends BaseModel {
  creatorId: number;
  title: string;
  description: string;
  categoryId: number;
  location: string;
  eventDate: Date;
  maxParticipants: number | null;
  currentParticipants: number;
}

export interface Category extends BaseModel {
  name: string;
  description?: string;
}

export interface EventParticipant extends BaseModel {
  eventId: number;
  userId: number;
  status: ParticipationStatus;
} 