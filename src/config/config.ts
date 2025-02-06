import dotenv from 'dotenv';
import { ConfigKeys } from './config.keys';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env.development';
dotenv.config({ path: envFile });

interface ConfigInterface {
  NODE_ENV: string;
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  LOG_LEVEL: string;
  CORS_ORIGIN: string;
  USER_SERVICE_URL: string;
  USER_SERVICE_API_KEY: string;
  isDevelopment(): boolean;
  isTest(): boolean;
  isProduction(): boolean;
}

export const Config: ConfigInterface = {
  // Server
  NODE_ENV: process.env[ConfigKeys.NODE_ENV] || 'development',
  PORT: parseInt(process.env[ConfigKeys.PORT] || '3000', 10),

  // Database
  DB_HOST: process.env[ConfigKeys.DB_HOST] || 'localhost',
  DB_PORT: parseInt(process.env[ConfigKeys.DB_PORT] || '5432', 10),
  DB_NAME: process.env[ConfigKeys.DB_NAME] || 'event_service_db',
  DB_USER: process.env[ConfigKeys.DB_USER] || 'postgres',
  DB_PASSWORD: process.env[ConfigKeys.DB_PASSWORD] || 'postgres',

  // JWT
  JWT_SECRET: process.env[ConfigKeys.JWT_SECRET] || 'your-secret-key',
  JWT_EXPIRES_IN: process.env[ConfigKeys.JWT_EXPIRES_IN] || '24h',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env[ConfigKeys.RATE_LIMIT_WINDOW_MS] || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env[ConfigKeys.RATE_LIMIT_MAX_REQUESTS] || '100', 10),

  // Logging
  LOG_LEVEL: process.env[ConfigKeys.LOG_LEVEL] || 'debug',

  // CORS
  CORS_ORIGIN: process.env[ConfigKeys.CORS_ORIGIN] || 'http://localhost:3000',

  // User Service
  USER_SERVICE_URL: process.env[ConfigKeys.USER_SERVICE_URL] || 'http://localhost:3002/api',
  USER_SERVICE_API_KEY: process.env[ConfigKeys.USER_SERVICE_API_KEY] || 'default-service-key-change-in-production',

  // Environment Checks
  isDevelopment(): boolean {
    return this.NODE_ENV === 'development';
  },

  isTest(): boolean {
    return this.NODE_ENV === 'test';
  },

  isProduction(): boolean {
    return this.NODE_ENV === 'production';
  }
}; 