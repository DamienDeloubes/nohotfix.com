Create a new API route for: $ARGUMENTS

Follow these steps in order:

1. **Schema** — Add Zod request schemas (`*RequestSchema`) and DTO schemas (`*DtoSchema`) to `packages/shared/src/schemas/`. Export types from `packages/shared/src/types/index.ts` and `packages/shared/src/index.ts`
2. **Port** (if external dependency) — Define the port interface in `packages/domains/{context}/src/ports/`. Export from ports barrel
3. **Adapter** (if new port) — Implement the adapter in `apps/api/src/adapters/services/`. Export from adapter barrel
4. **Use case** — Create the use-case in `packages/domains/{context}/src/use-cases/`. Follow the pattern: pure async function with `Deps` + `Command` interfaces, returns a shared DTO type from `@nohotfix/shared` (never an entity)
5. **Repository** — If new repo methods are needed, add them to the port interface and the Kysely repository in `apps/api/src/adapters/repositories/`
6. **Composition root** — Wire new repos/services/adapters in `apps/api/src/composition-root.ts` if needed
7. **Domain exports** — Export new use-cases/ports/errors from the domain package's `index.ts` and barrel files
8. **Route handler** — Add the handler to the appropriate file in `apps/api/src/routes/{context}.ts`. Follow the thin controller pattern:
   - Apply middleware via `preHandler` array (`orgScopeMiddleware` for org-scoped routes, `authMiddleware` for non-org routes, + guards)
   - Validate with Zod `.safeParse()` from `@nohotfix/shared`
   - Use `getSpan(request)` from `shared/lib/tracing.js` to add custom span attributes (spans are auto-created by `@fastify/otel`)
   - Call use-case, passing deps from `request.server.root`
   - Return reply with appropriate status code
   - For auth routes: use `buildAuthCookieOptions()` and cookie constants from `shared/lib/auth-cookies.js`
   - MUST NOT contain business logic, direct repo calls, or manual `tracer.startActiveSpan` tracing boilerplate
9. **Use case unit tests** — Write tests in `packages/domains/{context}/src/use-cases/__tests__/{name}.test.ts` with mocked deps
10. **Route integration tests** — Write a route test in the same routes directory with `.spec.ts` extension using `buildApp()` + `app.inject()`
11. **Verify** — Run `pnpm turbo run build typecheck test` to confirm everything compiles and passes
