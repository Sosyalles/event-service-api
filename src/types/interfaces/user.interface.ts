export interface UserDTO {
  id: number;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  followersCount: number;
  followingCount: number;
}

export interface UserProfileDTO extends UserDTO {
  isActive: boolean;
}

export interface UserAuthDTO extends UserDTO {
  isActive: boolean;
}

export interface UserVerificationResponse {
  id: number;
  username: string;
  userId: number;
  email: string;
  valid: boolean;
  roles: string[];
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
} 