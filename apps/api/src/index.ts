import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import { seekerAuthRoutes } from "./routes/seeker/auth";
import { seekerJobRoutes } from "./routes/seeker/jobs";
import { seekerSettingsRoutes } from "./routes/seeker/settings";
import { builderAuthRoutes } from "./routes/builder/auth";
import { builderSettingsRoutes } from "./routes/builder/settings";
import { feedRoutes } from "./routes/feed";
import { AppError, ErrorCode } from "./errors";
import { log } from "./logger";
import { config } from "./config";

const app = Fastify({ logger: false });

app.register(cors, {
  origin: config.cors.origin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});
app.register(cookie);
app.register(jwt, {
  secret: config.jwt.secret,
  cookie: { cookieName: "token", signed: false },
});

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

app.setNotFoundHandler((req, reply) => {
  log.warn(`Route not found: ${req.method} ${req.url}`);
  reply.status(404).send({
    error: { code: ErrorCode.NOT_FOUND, message: "Route not found" },
  });
});

app.get("/health", async () => ({ status: "ok" }));
app.register(seekerAuthRoutes);
app.register(seekerJobRoutes);
app.register(seekerSettingsRoutes);
app.register(builderAuthRoutes);
app.register(builderSettingsRoutes);
app.register(feedRoutes);

app.listen({ port: config.port, host: "0.0.0.0" }, (err) => {
  if (err) {
    log.error("Failed to start server", { error: err.message });
    process.exit(1);
  }
  log.info(`Server listening on :${config.port} [${config.env}]`);
});
