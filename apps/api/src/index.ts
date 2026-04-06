import { config } from "dotenv";
config({ path: "../../.env" });

import Fastify from "fastify";
import jwt from "@fastify/jwt";
import { seekerAuthRoutes } from "./routes/seeker/auth";
import { AppError, ErrorCode } from "./errors";
import { log } from "./logger";

const app = Fastify({ logger: false });

app.register(jwt, { secret: process.env.JWT_SECRET! });

app.addHook("onResponse", (req, reply, done) => {
  log.request(
    req.method,
    req.url,
    reply.statusCode,
    Math.round(reply.elapsedTime),
  );
  done();
});

app.setErrorHandler((error: any, req, reply) => {
  if (error instanceof AppError) {
    log.warn(`${error.code}: ${error.message}`, {
      url: req.url,
      method: req.method,
    });
    return reply.status(error.statusCode).send(error.toClient());
  }

  log.error(`Unhandled error: ${error.message}`, {
    url: req.url,
    method: req.method,
    stack: error.stack,
  });

  return reply.status(500).send({
    error: { code: ErrorCode.INTERNAL_ERROR, message: "Something went wrong" },
  });
});

app.get("/health", async () => ({ status: "ok" }));
app.register(seekerAuthRoutes);

app.listen({ port: 3001, host: "0.0.0.0" }, (err) => {
  if (err) {
    log.error("Failed to start server", { error: err.message });
    process.exit(1);
  }
  log.info("Server listening on :3001");
});
