export class ApiResponse {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: any,
    public success: boolean = true
  ) {}

  static success(data: any, message: string = 'Success'): ApiResponse {
    return new ApiResponse(200, message, data);
  }

  static created(data: any, message: string = 'Created successfully'): ApiResponse {
    return new ApiResponse(201, message, data);
  }

  static noContent(message: string = 'No content'): ApiResponse {
    return new ApiResponse(204, message);
  }

  static error(statusCode: number, message: string, data?: any): ApiResponse {
    return new ApiResponse(statusCode, message, data, false);
  }
} 