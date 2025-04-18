import { toast } from 'react-toastify';
import { z } from 'zod';

interface ErrorDetails {
  code: string;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private errors: ErrorDetails[] = [];
  private readonly MAX_ERRORS = 100;

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  logError(error: Error, context?: Record<string, unknown>) {
    const errorDetails: ErrorDetails = {
      code: error.name,
      message: error.message,
      timestamp: new Date(),
      context
    };

    this.errors.unshift(errorDetails);
    if (this.errors.length > this.MAX_ERRORS) {
      this.errors.pop();
    }

    console.error('Error logged:', errorDetails);
  }

  getErrors(): ErrorDetails[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }
}

export const handleError = (error: unknown, context?: Record<string, unknown>): void => {
  const logger = ErrorLogger.getInstance();

  if (error instanceof z.ZodError) {
    const message = error.errors.map(err => err.message).join(', ');
    toast.error(`שגיאת ולידציה: ${message}`);
    logger.logError(new Error(message), { type: 'validation', ...context });
    return;
  }

  if (error instanceof Error) {
    toast.error(error.message);
    logger.logError(error, context);
    return;
  }

  const genericError = new Error('שגיאה לא צפויה');
  toast.error(genericError.message);
  logger.logError(genericError, { originalError: error, ...context });
};

export const getErrorLogger = (): ErrorLogger => {
  return ErrorLogger.getInstance();
};