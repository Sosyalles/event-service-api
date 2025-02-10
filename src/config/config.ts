import dotenv from 'dotenv';
import { ConfigInterface } from '../types';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env.development';
dotenv.config({ path: envFile });

class Configuration implements ConfigInterface {
  // Server
  public readonly NODE_ENV: string;
  public readonly PORT: number;

  // Database
  public readonly DB_HOST: string;
  public readonly DB_PORT: number;
  public readonly DB_NAME: string;
  public readonly DB_USER: string;
  public readonly DB_PASSWORD: string;

  // JWT
  public readonly JWT_SECRET: string;
  public readonly JWT_EXPIRES_IN: string;

  // Rate Limiting
  public readonly RATE_LIMIT_WINDOW_MS: number;
  public readonly RATE_LIMIT_MAX_REQUESTS: number;

  // Logging
  public readonly LOG_LEVEL: string;

  // CORS
  public readonly CORS_ORIGIN: string;

  // User Service
  public readonly USER_SERVICE_URL: string;
  public readonly USER_SERVICE_API_KEY: string;

  constructor() {
    // Server
    this.NODE_ENV = process.env.NODE_ENV || 'development';
    this.PORT = parseInt(process.env.PORT || '3000', 10);

    // Database
    this.DB_HOST = process.env.DB_HOST || 'localhost';
    this.DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
    this.DB_NAME = process.env.DB_NAME || 'event_service_db';
    this.DB_USER = process.env.DB_USER || 'postgres';
    this.DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';

    // JWT
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

    // Rate Limiting
    this.RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10);
    this.RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);

    // Logging
    this.LOG_LEVEL = process.env.LOG_LEVEL || 'debug';

    // CORS
    this.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

    // User Service
    this.USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:8080';
    this.USER_SERVICE_API_KEY = process.env.USER_SERVICE_API_KEY || 'default-service-key-change-in-production';
  }

  public isDevelopment(): boolean {
    return this.NODE_ENV === 'development';
  }

  public isTest(): boolean {
    return this.NODE_ENV === 'test';
  }

  public isProduction(): boolean {
    return this.NODE_ENV === 'production';
  }
}

export const Config = new Configuration(); 