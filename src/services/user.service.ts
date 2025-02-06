import { UserDTO, UserProfileDTO, UserAuthDTO } from '../types/models';
import { Config } from '../config/config';
import { ApiError } from '../utils/ApiError';

class UserService {
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
        headers: { ...this.defaultHeaders, ...options.headers },
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw ApiError.notFound('User not found');
        }
        if (response.status === 401) {
          throw ApiError.unauthorized('Unauthorized access to user service');
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
      `${this.baseUrl}/internal/users/${userId}`
    );
    const userData = await response.json() as UserAuthDTO;
    
    if (!userData.isActive) {
      throw ApiError.unauthorized('User account is not active');
    }
    
    return userData;
  }

  async getUserProfile(userId: number): Promise<UserProfileDTO> {
    const response = await this.fetchWithError(
      `${this.baseUrl}/internal/users/${userId}/profile`
    );
    return await response.json() as UserProfileDTO;
  }

  async getUserBasicInfo(userId: number): Promise<UserDTO> {
    const response = await this.fetchWithError(
      `${this.baseUrl}/internal/users/${userId}`
    );
    return await response.json() as UserDTO;
  }

  async validateToken(token: string): Promise<UserAuthDTO> {
    const response = await this.fetchWithError(
      `${this.baseUrl}/internal/auth/validate`,
      {
        method: 'POST',
        body: JSON.stringify({ token }),
      }
    );
    return await response.json() as UserAuthDTO;
  }

  async getMultipleUsers(userIds: number[]): Promise<UserDTO[]> {
    if (!userIds.length) return [];
    
    const response = await this.fetchWithError(
      `${this.baseUrl}/internal/users/list`,
      {
        method: 'POST',
        body: JSON.stringify({ userIds }),
      }
    );
    return await response.json() as UserDTO[];
  }

  async searchUsers(query: string): Promise<UserDTO[]> {
    const response = await this.fetchWithError(
      `${this.baseUrl}/internal/users/search?query=${encodeURIComponent(query)}`
    );
    return await response.json() as UserDTO[];
  }

  async checkUserExists(email: string): Promise<boolean> {
    try {
      await this.fetchWithError(
        `${this.baseUrl}/internal/users/check-email?email=${encodeURIComponent(email)}`
      );
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return false;
      }
      throw error;
    }
  }
}

export const userService = new UserService(); 