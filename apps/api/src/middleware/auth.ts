import { FastifyRequest } from "fastify";
import { AppError, ErrorCode } from "../errors";

export type AuthPayload = {
  id: string;
  email: string;
  role: "seeker";
};

export async function requireAuth(req: FastifyRequest) {
  try {
    const payload = await req.jwtVerify<AuthPayload>();
    req.user = payload;
  } catch {
    throw new AppError(ErrorCode.UNAUTHORIZED, "Not authenticated");
  }
}
