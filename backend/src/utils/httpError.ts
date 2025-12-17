// utils/httpError.ts

/**
 * Custom HTTP error class.
 *
 * Used to represent expected, controlled errors
 * that occur during request handling.
 *
 * This allows services and controllers to throw
 * meaningful errors that can be translated into
 * proper HTTP responses by centralized error
 * handling middleware.
 */
export class HttpError extends Error {
  /**
   * HTTP status code associated with the error.
   *
   * Examples:
   * - 400: Bad Request
   * - 401: Unauthorized
   * - 403: Forbidden
   * - 404: Not Found
   * - 500: Internal Server Error
   */
  statusCode: number;

  /**
   * Creates a new HttpError instance.
   *
   * @param statusCode - HTTP status code to return to the client
   * @param message - Human-readable error description
   */
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
