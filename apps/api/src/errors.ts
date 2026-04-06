export const ErrorCode = {
  // 400
  BAD_REQUEST: "BAD_REQUEST",
  VALIDATION_ERROR: "VALIDATION_ERROR",

  // 401
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_OTP: "INVALID_OTP",
  EXPIRED_OTP: "EXPIRED_OTP",
  INVALID_TOKEN: "INVALID_TOKEN",

  // 403
  FORBIDDEN: "FORBIDDEN",

  // 404
  NOT_FOUND: "NOT_FOUND",

  // 429
  TOO_MANY_ATTEMPTS: "TOO_MANY_ATTEMPTS",

  // 500
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

const STATUS_MAP: Record<ErrorCode, number> = {
  BAD_REQUEST: 400,
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  INVALID_OTP: 401,
  EXPIRED_OTP: 401,
  INVALID_TOKEN: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_ATTEMPTS: 429,
  INTERNAL_ERROR: 500,
};

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
  ) {
    super(message);
  }

  get statusCode() {
    return STATUS_MAP[this.code];
  }

  toClient() {
    return { error: { code: this.code, message: this.message } };
  }
}
