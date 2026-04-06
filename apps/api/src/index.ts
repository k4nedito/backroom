import { config } from "dotenv";
config({ path: "../../.env" });

import Fastify from "fastify";
import jwt from "@fastify/jwt";
import { seekerAuthRoutes } from "./routes/seeker/auth";

const app = Fastify({ logger: true });

app.register(jwt, { secret: process.env.JWT_SECRET! });

app.get("/health", async () => ({ status: "ok" }));
app.register(seekerAuthRoutes);

app.listen({ port: 3001, host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
