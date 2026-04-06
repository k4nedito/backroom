import { db } from "../db";
import { otpCodes } from "../db/schema";
import { eq, and, gt } from "drizzle-orm";
import { Resend } from "resend";
import { AppError, ErrorCode } from "../errors";
import { log } from "../logger";
import { config } from "../config";

const resend = new Resend(config.resend.apiKey);

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createAndSendOtp(email: string) {
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + config.otp.expiryMinutes * 60 * 1000);

  await db.insert(otpCodes).values({ email, code, expiresAt });

  if (config.isDev) {
    log.info(`[DEV] OTP for ${email}: ${code}`);
    return;
  }

  const { error } = await resend.emails.send({
    from: config.resend.from,
    to: email,
    subject: "Your login code",
    text: `Your code is ${code}. It expires in ${config.otp.expiryMinutes} minutes.`,
  });

  if (error) {
    log.error("Failed to send OTP email", { email, resendError: error });
    throw new AppError(ErrorCode.INTERNAL_ERROR, "Failed to send verification email");
  }

  log.info("OTP sent", { email });
}

export async function verifyOtp(email: string, code: string) {
  const [otp] = await db
    .select()
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.email, email),
        eq(otpCodes.code, code),
        gt(otpCodes.expiresAt, new Date())
      )
    )
    .orderBy(otpCodes.createdAt)
    .limit(1);

  if (!otp) throw new AppError(ErrorCode.INVALID_OTP, "Invalid or expired code");
  if (otp.attempts >= config.otp.maxAttempts)
    throw new AppError(ErrorCode.TOO_MANY_ATTEMPTS, "Too many attempts");

  await db.update(otpCodes).set({ attempts: otp.attempts + 1 }).where(eq(otpCodes.id, otp.id));
  await db.delete(otpCodes).where(eq(otpCodes.id, otp.id));
}
