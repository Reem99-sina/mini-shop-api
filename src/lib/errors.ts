export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly error: string,
    message: string
  ) {
    super(message);
  }
}

export const badRequest = (message: string) => new ApiError(400, "Bad Request", message);
export const unauthorized = (message = "Authentication required") =>
  new ApiError(401, "Unauthorized", message);
export const forbidden = (message = "Admin access required") => new ApiError(403, "Forbidden", message);
export const notFound = (message: string) => new ApiError(404, "Not Found", message);
