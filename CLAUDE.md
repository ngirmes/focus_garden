# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**focus_garden** is a full-stack web application consisting of a React 19 + Vite frontend (`client/`) and an Express 5 + TypeScript backend (`server/`) backed by PostgreSQL.

The purpose of the application is to help users build better focus habits by gamifying focused work sessions.

Users start a focus timer to grow virtual plants. When a focus session is completed, the corresponding plant gains growth progress based on the session's duration. As plants reach their growth thresholds, they evolve through multiple stages. Once fully grown, plants can be sold for in-game currency, which can be spent on new seeds, decorations, and future gameplay features.

If a focus session is cancelled or invalidated before completion, no growth progress is awarded.

The backend is the authoritative source of truth for all game progression, rewards, and user data. The frontend is responsible for presenting the current game state and user interface.

## Collaboration Guidelines

- Prefer teaching and explaining unfamiliar concepts over only generating code.
- Preserve the existing architecture unless there is a clear reason to change it.
- Recommend modern best practices while avoiding unnecessary complexity.
- When proposing major architectural changes, explain the tradeoffs.

## Design Principles

- Favor simple, readable code over clever abstractions.
- Keep controllers/routes thin; business logic belongs in services.
- Database access belongs only in `server/src/db`.
- Prefer composition over inheritance.
- Avoid duplication but don't abstract prematurely.
- Keep functions small and focused.

## API Design

- Use RESTful endpoints.
- Return consistent JSON responses.
- Use appropriate HTTP status codes.
- Return user-friendly error messages.
- Do not leak implementation details in errors.

## Error Handling

- Throw errors rather than silently swallowing them.
- Let the global error handler format unexpected errors.
- Return meaningful 4xx responses for user errors.
- Return 500 only for unexpected server failures.

## Authentication

- Protected routes must use `requireAuth`.
- Never trust user IDs supplied by the client.
- Use `req.user.userId` after JWT verification.
- Do not store sensitive user information inside JWT payloads.

## Security

- Never trust client input.
- Every request body, route parameter, and query parameter should be validated with Zod before business logic executes.
- Use parameterized SQL queries exclusively. Never build SQL with string interpolation.
- Never expose database errors directly to clients.
- JWTs must always be verified server-side using `requireAuth`.
- Authorization should be enforced server-side even if the UI hides actions.
- Passwords must be hashed with bcrypt before storage.
- Secrets should only come from environment variables.

## Frontend

- Keep components small and reusable.
- Separate UI components from business logic.
- Custom hooks belong in `hooks/`.
- API calls belong in `services/api`.
- Avoid prop drilling when reasonable.

## Code Style

- Prefer async/await.
- Prefer early returns.
- Avoid nested conditionals.
- Use descriptive variable names.
- Favor readability over brevity.

## Game Logic

- The backend is the source of truth for progression.
- Clients should never award themselves currency or experience.
- Focus duration should always be validated server-side.
- PixiJS is purely visual and should never determine game state.

## Comments

- Write comments explaining _why_, not _what_.
- Avoid redundant comments.
- Prefer self-documenting code.

## Application Flow

Client

↓

Route

↓

Service

↓

Database

↓

Response

React renders the returned state.

PixiJS visualizes the current state.

## Quality Standards

Before implementing new features:

- Reuse existing abstractions when appropriate.
- Minimize unnecessary dependencies.
- Keep APIs consistent with the existing codebase.
- Prefer maintainability over cleverness.
- Explain non-obvious decisions.

## Commands

### Server

```bash
cd server
npm run dev        # ts-node + nodemon (watches src/)
npm run build      # tsc → dist/
npm start          # node dist/index.js (after build)
npm run db:migrate # run migration against DATABASE_URL
```

### Client

```bash
cd client
npm run dev        # Vite HMR dev server
npm run build      # tsc -b && vite build
npm run lint       # eslint
npm run preview    # serve the built output
```

No tests exist yet.

## Environment setup

Copy `server/.env.example` to `server/.env` and fill in:

| Variable         | Required | Default |
| ---------------- | -------- | ------- |
| `DATABASE_URL`   | yes      | —       |
| `JWT_SECRET`     | yes      | —       |
| `PORT`           | no       | `4000`  |
| `JWT_EXPIRES_IN` | no       | `7d`    |

`server/src/config/env.ts` throws at startup if any required variable is missing.

## Architecture

### Server (`server/src/`)

- `routes/` — HTTP layer only. Validate requests and delegate to services.
- `services/` — Business logic and application rules.
- `db/` — Database access only. No business logic.
- `middleware/` — Authentication, error handling, logging.
- `config/` — Environment configuration.

- `app.ts` — Express app: CORS, JSON body parsing, mounts `/api` router, registers error handler
- `index.ts` — calls `app.listen` using `env.port`
- `config/env.ts` — validates and exports all env vars; import `env` from here rather than `process.env` directly
- `db/index.ts` — exports a `pg.Pool` and a typed `query<T>()` helper; all SQL goes through this
- `db/*.ts` — one file per domain entity (e.g. `users.ts`) containing typed query functions
- `db/schema.sql` + `db/migrate.ts` — schema applied by `npm run db:migrate`
- `routes/index.ts` — root `/api` router; mounts sub-routers by domain
- `routes/auth.ts` — `POST /api/auth/register` and `POST /api/auth/login`; returns `{ token, user: { id, email } }`
- `middleware/auth.ts` — `requireAuth` middleware; verifies Bearer JWT and attaches `req.user: { userId: number }` (also augments Express `Request` type globally)
- `middleware/errorHandler.ts` — catch-all Express error handler; logs and returns `{ error: string }`

**Adding a new feature:** create `db/<entity>.ts` with typed query functions, a `routes/<entity>.ts` router, and mount it in `routes/index.ts`.

### Client (`client/src/`)

Standard Vite + React scaffold; `main.tsx` → `App.tsx`. No router or state management added yet.

## Frontend Architecture

The frontend uses:

- React 19
- Vite
- TypeScript
- Tailwind CSS
- PixiJS for rendering the interactive garden scene.

React is responsible for application state, routing, forms, authentication, and UI.

PixiJS is responsible only for rendering and animating the garden. React should not directly manipulate Pixi display objects except through well-defined components or hooks.
