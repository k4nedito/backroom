import { db } from "../db";
import { otpCodes } from "../db/schema";
import { eq, and, gt } from "drizzle-orm";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createAndSendOtp(email: string) {
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await db.insert(otpCodes).values({ email, code, expiresAt });

  await resend.emails.send({
    from: "Backrooms <noreply@backrooms.app>",
    to: email,
    subject: "Your login code",
    text: `Your code is ${code}. It expires in 10 minutes.`,
  });
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

  if (!otp) return { valid: false, error: "Invalid or expired code" } as const;
  if (otp.attempts >= 5) return { valid: false, error: "Too many attempts" } as const;

  await db.update(otpCodes).set({ attempts: otp.attempts + 1 }).where(eq(otpCodes.id, otp.id));
  await db.delete(otpCodes).where(eq(otpCodes.id, otp.id));

  return { valid: true } as const;
}
