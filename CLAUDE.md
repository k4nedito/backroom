# Backrooms

Freelance platform. Builders (talent) pay $X/month flat, Seekers (hiring side) post for free. No commission, no tiers, no bullshit.

## Terminology

- Builder = talent. Seeker = hiring side.
- Never use "freelancer" or "client" anywhere.

## Stack

- Fastify backend
- PostgreSQL + Drizzle ORM
- Next.js + shadcn/ui frontend
- Docker
- Stripe for subscriptions
- Claude/OpenAI API for AI moderation

## Rules

- Use pnpm. Always.
- Never write migration SQL manually. Use `drizzle-kit generate` and `drizzle-kit migrate`.
- Keep it simple. No overengineering, no abstractions until they're needed.
- If it works in one file, don't split it into five.
