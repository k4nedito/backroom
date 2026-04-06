import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: string; email: string; role: "seeker" };
    user: { id: string; email: string; role: "seeker" };
  }
}
