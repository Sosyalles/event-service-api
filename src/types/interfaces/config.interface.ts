export interface ConfigInterface {
  // Server
  NODE_ENV: string;
  PORT: number;

  // Database
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;

  // JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;

  // Logging
  LOG_LEVEL: string;

  // CORS
  CORS_ORIGIN: string;

  // User Service
  USER_SERVICE_URL: string;
  USER_SERVICE_API_KEY: string;

  // Environment Checks
  isDevelopment(): boolean;
  isTest(): boolean;
  isProduction(): boolean;
} 