Create a new domain entity for: $ARGUMENTS

Follow these steps:

1. **Entity class** — Create in `packages/domains/{context}/src/entities/`
   - Private constructor with `readonly props`
   - Static `create(params)` — validates via value objects, returns new instance
   - Static `reconstitute(props)` — trusts persistence layer, no validation
   - Mutation methods return new instances (immutable)
   - Getter properties for each field

2. **Value objects** — Create in `packages/domains/{context}/src/entities/value-objects/`
   - Private constructor + static `create(raw)` with validation
   - `equals(other)` for structural comparison
   - `toString()` returning underlying value
   - Throw domain errors on invalid input

3. **Error classes** — Create in `packages/domains/{context}/src/errors/`
   - Each error extends `DomainError` from `@nohotfix/shared`
   - Add new error codes to `packages/shared/src/errors/codes.ts` (format: `DOMAIN_CATEGORY_SPECIFIC`)
   - Include appropriate HTTP status code

4. **Port interface** — Define repository interface in `packages/domains/{context}/src/ports/`
   - TypeScript interface only, no implementation
   - Standard methods: `findById`, `create`, `update`, etc.

5. **Exports** — Re-export everything from the domain package's `src/index.ts`

6. **Unit tests** — Write tests in `packages/domains/{context}/src/entities/__tests__/` using `.test.ts` naming
   - Test both happy path and validation errors
   - Test immutability (methods return new instances)
   - Test equality and string conversion on value objects
   - No mocks — these are pure tests

7. **Verify** — Run `pnpm --filter @nohotfix/domain-{context} test` and `pnpm turbo run typecheck`
