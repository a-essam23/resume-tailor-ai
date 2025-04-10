import { log } from "./logger";

type ErrorOptions = {
  code?: string; // Machine-readable error code
  statusCode?: number; // HTTP status code (if applicable)
  details?: unknown; // Additional error details
  cause?: Error; // Original error (for error chaining)
};

class AppError extends Error {
  code: string;
  statusCode?: number;

  constructor(message: string, options: ErrorOptions | number = {}) {
    // Handle shorthand syntax (message, statusCode)
    if (typeof options === "number") {
      options = { statusCode: options };
    }

    super(message || "Something went wrong");

    // Set prototype explicitly for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.code = options.code || "INTERNAL_ERROR";
    this.statusCode = options.statusCode;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    // Preserve original error
    if (options.cause || options.details) {
      this.cause = options.cause;
      this.stack += `\nCaused by: ${options?.cause?.stack || ""} \n ${
        options.details || ""
      }`;
    }
    log.error(this.message);
    console.log(options.details);
  }

  // TypeScript 4.6+ supports native cause property
  declare cause?: Error;
  // Optional: Add serialization method for APIs
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

export default AppError;
