export interface BaseModel {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

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

export enum ParticipationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

// External User Service Types
export interface UserDTO {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileDTO {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
}

export interface UserAuthDTO {
  id: number;
  email: string;
  roles: string[];
  isActive: boolean;
} 