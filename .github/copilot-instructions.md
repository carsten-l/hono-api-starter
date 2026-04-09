# Copilot Instructions for This API

You are working in a Hono + Prisma + Zod REST API.

Follow these rules whenever creating or updating endpoints.

## Architecture and file layout
- Keep each feature in src/features/<feature>/ with:
  - api.ts for routes
  - services.ts for business and database logic
  - validation.ts for Zod schemas and types
- Keep handlers thin and move data access to services.
- Register new routers in src/app.ts.

## Centralized error handling (required)
- Use centralized error handling as the default strategy.
- Do not build one-off error response logic in every handler.
- Prefer throwing typed HTTP errors from handlers/services and letting app-level middleware format responses.

### Error model
- Use a consistent response shape for all failures:
  - success: false
  - error: string (stable machine-friendly code)
  - message: string (human-readable)
  - details: optional object/array for validation metadata
- Use appropriate status codes:
  - 400 for validation and bad input
  - 401 for unauthorized
  - 403 for forbidden
  - 404 for not found
  - 409 for conflicts
  - 422 for semantically invalid data
  - 500 for unexpected errors

### Handler behavior
- Validate request body/params/query with Zod.
- If validation fails, throw a typed bad request error (or equivalent), do not return ad-hoc JSON in each route.
- If a record is missing, throw not-found error from services or route.
- For unexpected exceptions, let them bubble to the global error handler.

### App-level behavior
- Ensure a single global error handler exists in src/app.ts (or imported setup) and is used for all routes.
- Ensure unknown routes return a consistent not-found JSON shape.
- Keep internal error details out of production responses.

## Endpoint generation rules
When asked to add a resource, prefer this baseline set unless specified otherwise:
- GET /
- GET /:id
- POST /
- PUT or PATCH /:id
- DELETE /:id

## Unknown endpoint data model flow (required)
- If a new endpoint introduces unknown fields, a new entity, or new relations, update the Prisma schema first in prisma/schema.prisma.
- Add/update Zod schemas in the feature validation.ts to match the Prisma model shape and endpoint contract.
- Keep create and update schemas explicit so generated handlers do not accept unintended fields.
- Ensure service input/output types align with Zod inferred types and Prisma input types.

### Migration requirements
- After Prisma schema changes, create a migration with a descriptive name using Prisma Migrate Dev.
- Never leave schema changes without a migration in prisma/migrations.
- Regenerate Prisma Client as part of the migration flow.
- If migration drift is detected, resolve it with the Prisma migrate status/reset workflow before finalizing endpoint code.
- Do not write manual SQL migrations unless explicitly requested.

Use this pattern:
- validation.ts: define create/update schemas and exported types
- services.ts: implement CRUD with Prisma
- api.ts: bind routes, validate inputs, call services, return success payloads

## Status codes and success responses
- POST create: return 201.
- GET/PUT/PATCH: return 200.
- DELETE: return 200 with message or 204 with no body.
- Keep successful JSON responses consistent per feature.

## Security and data hygiene
- Never return secrets (passwords, tokens, hashes).
- Strip sensitive fields in service layer.
- Do not trust raw c.req.json() without schema validation.

## Code quality checks before finishing
- Imports compile and route is registered.
- Schemas align with service input types.
- Prisma schema and generated migration are included when data model changes.
- Route handlers contain minimal logic.
- Error paths rely on centralized handler.
- No duplicated try/catch blocks that only reshape errors.
