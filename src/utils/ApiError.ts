export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: string[],
    public isOperational = true
  ) {
    super(message);
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg: string, errors?: string[]): ApiError {
    return new ApiError(400, msg, errors);
  }

  static unauthorized(msg: string = 'Unauthorized'): ApiError {
    return new ApiError(401, msg);
  }

  static forbidden(msg: string = 'Forbidden'): ApiError {
    return new ApiError(403, msg);
  }

  static notFound(msg: string = 'Not found'): ApiError {
    return new ApiError(404, msg);
  }

  static internal(msg: string = 'Internal server error'): ApiError {
    return new ApiError(500, msg, undefined, false);
  }
} 