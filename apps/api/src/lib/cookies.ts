import { FastifyReply } from "fastify";
import { config } from "../config";

export function setAuthCookie(reply: FastifyReply, token: string) {
  reply.setCookie("token", token, {
    path: "/",
    httpOnly: true,
    secure: !config.isDev,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export function setSignupCookie(reply: FastifyReply, token: string) {
  reply.setCookie("signup_token", token, {
    path: "/",
    httpOnly: true,
    secure: !config.isDev,
    sameSite: "lax",
    maxAge: 15 * 60, // 15 minutes
  });
}
