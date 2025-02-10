import { UserDTO, UserProfileDTO, UserAuthDTO, UserVerificationResponse } from '../types';
import { Config } from '../config/config';
import { ApiError } from '../utils/ApiError';

export interface IUserService {
  validateUser(userId: number): Promise<UserAuthDTO>;
  getUserProfile(userId: number): Promise<UserProfileDTO>;
  getUserBasicInfo(userId: number): Promise<UserDTO>;
  validateToken(token: string): Promise<UserVerificationResponse>;
  getMultipleUsers(userIds: number[]): Promise<UserDTO[]>;
  searchUsers(query: string): Promise<UserDTO[]>;
  checkUserExists(email: string): Promise<boolean>;
  getUserByUsername(username: string): Promise<UserDTO>;
  getUserByEmail(email: string): Promise<UserDTO>;
}

class UserService implements IUserService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = Config.USER_SERVICE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'X-API-KEY': Config.USER_SERVICE_API_KEY
    };
  }

  private async fetchWithError(url: string, options: RequestInit = {}): Promise<Response> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...this.defaultHeaders, ...options.headers }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw ApiError.notFound('User not found');
        }
        if (response.status === 401) {
          throw ApiError.unauthorized('Unauthorized access to user service');
        }
        if (response.status === 403) {
          throw ApiError.forbidden('Forbidden access to user service');
        }
        throw ApiError.internal('Error communicating with user service');
      }

      return response;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error('User service error:', error);
      throw ApiError.internal('Error communicating with user service');
    }
  }

  async validateUser(userId: number): Promise<UserAuthDTO> {
    const response = await this.fetchWithError(
      `${this.baseUrl}/api/internal/users/${userId}`
    );
    const userData = await response.json() as UserAuthDTO;
    
    if (!userData.isActive) {
      throw ApiError.unauthorized('User account is not active');
    }
    
    return userData;
  }

  async getUserProfile(userId: number): Promise<UserProfileDTO> {
    const response = await this.fetchWithError(
      `${this.baseUrl}/api/users/${userId}`
    );
    return await response.json() as UserProfileDTO;
  }

  async getUserBasicInfo(userId: number): Promise<UserDTO> {
    const response = await this.fetchWithError(
      `${this.baseUrl}/api/internal/users/${userId}`
    );
    return await response.json() as UserDTO;
  }

  async validateToken(token: string): Promise<UserVerificationResponse> {
    const response = await this.fetchWithError(
      `${this.baseUrl}/internal/auth/verify`,
      {
        method: 'POST',
        headers: {
          ...this.defaultHeaders,
          'Authorization': `Bearer ${token}`
        }
      }
    );
    const result = await response.json() as { data: UserVerificationResponse };
    return result.data;
  }

  async getMultipleUsers(userIds: number[]): Promise<UserDTO[]> {
    if (!userIds.length) return [];
    
    const queryString = userIds.map(id => `ids=${id}`).join('&');
    const response = await this.fetchWithError(
      `${this.baseUrl}/api/internal/users/list?${queryString}`
    );
    return await response.json() as UserDTO[];
  }

  async searchUsers(query: string): Promise<UserDTO[]> {
    const response = await this.fetchWithError(
      `${this.baseUrl}/api/users/search?username=${encodeURIComponent(query)}`
    );
    return await response.json() as UserDTO[];
  }

  async checkUserExists(email: string): Promise<boolean> {
    try {
      await this.getUserByEmail(email);
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<UserDTO> {
    const response = await this.fetchWithError(
      `${this.baseUrl}/api/internal/users/username/${encodeURIComponent(username)}`
    );
    return await response.json() as UserDTO;
  }

  async getUserByEmail(email: string): Promise<UserDTO> {
    const response = await this.fetchWithError(
      `${this.baseUrl}/api/internal/users/email/${encodeURIComponent(email)}`
    );
    return await response.json() as UserDTO;
  }
}

export const userService = new UserService();
export default userService; 