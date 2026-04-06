import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: Record<string, unknown>;
    user: { id: string; email: string; name: string; role: "seeker" | "builder" };
  }
}
