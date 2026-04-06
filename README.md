# Backrooms

A platform for getting shit done (that doesn't actually sucks).

## Stack

- **Backend**: Fastify + PostgreSQL + Drizzle ORM
- **Frontend**: Next.js 16 + React 19 + shadcn/ui + Tailwind CSS 4
- **Auth**: Passwordless OTP via email (Resend) + JWT in HTTP-only cookies
- **Monorepo**: pnpm workspaces + Turborepo

## Project structure

```
backrooms/
├── apps/
│   ├── api/          # Fastify backend (port 3001)
│   └── web/          # Next.js frontend (port 3000)
├── packages/
│   ├── ui/           # Shared shadcn/ui component library
│   ├── eslint-config/
│   └── typescript-config/
├── docker-compose.yml  # PostgreSQL 17
└── turbo.json
```

### Backend (`apps/api`)

Fastify REST API with Drizzle ORM. Key areas:

- **`src/db/schema.ts`** - Database schema (seekers, builders, jobs, submissions, otpCodes)
- **`src/routes/`** - Fastify routers
- **`src/services/`** - Business logic layer (atp it's just db calls)
- **`src/middleware/`** - JWT auth middleware

### Frontend (`apps/web`)

Next.js app with server and client components.

- **`app/auth/`** - Unified auth page (role toggle, OTP flow, signup)
- **`app/feed/`** - Public job feed with search/filters
- **`app/seeker/`** - Seeker dashboard (my jobs, post jobs, settings)
- **`app/builder/`** - Builder profile, settings
- **`components/`** - Shared layout components (navbar, profile menu)
- **`lib/`** - API helper, auth utilities

### Shared UI (`packages/ui`)

shadcn/ui components used across the frontend. To add a new component:

```bash
pnpm dlx shadcn@latest add <component> -c apps/web
```

## Getting started

### Prerequisites

- Node.js 20+
- pnpm
- Docker

### Setup

```bash
# Start PostgreSQL
docker compose up -d

# Install dependencies
pnpm install

# Copy env file and adjust if needed
cp apps/api/.env.example apps/api/.env

# Push database schema (dev only)
pnpm --filter @backrooms/api db:push

# Run everything
pnpm dev

# Above command will log both frontend and backend stuff, to avoid clutter, run separately:
pnpm --filter web dev
pnpm --filter @backrooms/api dev
```

### Environment variables

| Variable              | Where | Description                                       |
| --------------------- | ----- | ------------------------------------------------- |
| `DATABASE_URL`        | api   | PostgreSQL connection string                      |
| `JWT_SECRET`          | api   | Secret for signing JWTs                           |
| `RESEND_API_KEY`      | api   | Resend API key for sending OTP emails             |
| `CORS_ORIGIN`         | api   | Allowed origin (default: `http://localhost:3000`) |
| `NEXT_PUBLIC_API_URL` | web   | Backend URL (default: `http://localhost:3001`)    |

## Database

Schema is managed with Drizzle. Never write migration SQL manually.

```bash
# Generate migration from schema changes
pnpm --filter @backrooms/api db:generate

# Run migrations
pnpm --filter @backrooms/api db:migrate

# Open Drizzle Studio
pnpm --filter @backrooms/api db:studio

# For dev, just push

pnpm --filter @backrooms/api db:push
```
