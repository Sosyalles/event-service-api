import { Request, Response } from 'express';
import db from '../config/database';

export const healthCheck = async (_req: Request, res: Response) => {
  try {
    // Check database connection
    await db.authenticate();

    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
      database: 'Connected'
    };

    res.status(200).json(healthcheck);
  } catch (error) {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'ERROR',
      timestamp: Date.now(),
      database: 'Disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    res.status(503).json(healthcheck);
  }
}; 