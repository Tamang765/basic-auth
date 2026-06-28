/**
 * Standardized API Response Class
 */

export class ApiResponse<T = unknown, E = unknown> {
  statusCode: number;
  message: string;
  data: T | null;
  errors: E | null;
  timestamp: string;

  constructor(
    statusCode: number,
    message: string = "Success",
    data: T | null = null,
    errors: E | null = null,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
  }

  static success<T, E = unknown>(
    statusCode: number,
    message: string,
    data?: T,
  ) {
    return new ApiResponse<T, E>(statusCode, message, data ?? null, null);
  }

  static error<T = unknown, E = unknown>(
    statusCode: number,
    message: string,
    errors?: E,
  ) {
    return new ApiResponse<T, E>(statusCode, message, null, errors ?? null);
  }

  static created<T>(message = "Created Successfully", data?: T) {
    return new ApiResponse<T>(201, message, data ?? null, null);
  }

  static ok<T>(message = "Success", data?: T) {
    return new ApiResponse<T>(200, message, data ?? null, null);
  }

  static badRequest<E = unknown>(message = "Bad Request", errors?: E) {
    return new ApiResponse<null, E>(400, message, null, errors ?? null);
  }

  static notFound(message = "Resource Not Found") {
    return new ApiResponse(404, message, null, null);
  }

  static serverError(message = "Internal Server Error") {
    return new ApiResponse(500, message, null, null);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiResponse(401, message, null, null);
  }

  static forbidden(message = "Forbidden") {
    return new ApiResponse(403, message, null, null);
  }

  static conflict(message = "Resource Already Exists") {
    return new ApiResponse(409, message, null, null);
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      errors: this.errors,
      timestamp: this.timestamp,
    };
  }
}
