export const config = {
  env: (process.env.NODE_ENV ?? "development") as "development" | "production",
  isDev: (process.env.NODE_ENV ?? "development") === "development",
  port: Number(process.env.PORT ?? 3001),
  db: {
    url: process.env.DATABASE_URL!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY!,
    from: process.env.EMAIL_FROM ?? "Backrooms <onboarding@resend.dev>",
  },
  cors: {
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  },
  otp: {
    expiryMinutes: 10,
    maxAttempts: 5,
  },
} as const;
