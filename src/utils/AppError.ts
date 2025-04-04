class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message || "Something went wrong");
    this.statusCode = statusCode || 500;
    this.name = this.constructor.name || "UNKNOWN_ERROR";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
