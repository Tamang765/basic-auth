import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/api-response.js";
import { logger } from "../utils/logger.js";

/**
 * Base Application Error
 */
export class ApplicationError<T = unknown> extends Error {
  statusCode: number;
  errors: T | null;

  constructor(message: string, statusCode = 500, errors: T | null = null) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error
 */
export class ValidationError<T = unknown> extends ApplicationError<T> {
  constructor(message: string, errors: T) {
    super(message, 400, errors);
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends ApplicationError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

/**
 * Conflict Error
 */
export class ConflictError extends ApplicationError {
  constructor(message = "Resource already exists") {
    super(message, 409);
  }
}

/**
 * Unauthorized Error
 */
export class UnauthorizedError extends ApplicationError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

/**
 * Forbidden Error
 */
export class ForbiddenError extends ApplicationError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let error: ApplicationError;

  if (err instanceof ApplicationError) {
    error = err;
  } else if (err instanceof Error) {
    error = new ApplicationError(err.message, 500);
  } else {
    error = new ApplicationError("Internal Server Error", 500);
  }

  logger.error(
    {
      err: error,
      statusCode: error.statusCode,
      method: req.method,
      path: req.path,
      errors: error.errors,
    },
    `${error.name}: ${error.message}`,
  );

  const response = ApiResponse.error(
    error.statusCode,
    error.message,
    error.errors,
  );

  res.status(error.statusCode).json(response.toJSON());
};

/**
 * Async Middleware Wrapper
 */
export const asyncHandler =
  <T extends Request = Request>(
    fn: (req: T, res: Response, next: NextFunction) => Promise<any>,
  ) =>
  (req: T, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
