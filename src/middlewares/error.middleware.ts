import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'sequelize';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json(
      ApiResponse.error(err.statusCode, err.message, err.errors)
    );
    return;
  }

  if (err instanceof ValidationError) {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    res.status(400).json(
      ApiResponse.error(400, 'Validation error', errors)
    );
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json(
      ApiResponse.error(401, 'Invalid token')
    );
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json(
      ApiResponse.error(401, 'Token expired')
    );
    return;
  }

  // Default error
  const statusCode = 500;
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Internal server error';
  
  res.status(statusCode).json(
    ApiResponse.error(statusCode, message)
  );
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json(
    ApiResponse.error(404, `Cannot ${req.method} ${req.url}`)
  );
}; 