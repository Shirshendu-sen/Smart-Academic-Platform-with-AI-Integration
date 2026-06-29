# CHANGES.md

## Deviations from guide.md

### Phase 3 — Step 3.1
- **Change:** Added `as string` type assertion for `req.params.id` in `Enrollment.create()` call (courses.ts line 84).
- **Reason:** TypeScript strict mode with current `@types/express` version infers `req.params` values as `string | string[]` when middleware is in the handler chain. The assertion resolves the type mismatch with Mongoose's ObjectId field.

### Phase 4 — Step 4.4
- **Change:** Replaced `gemini-1.5-flash` model with `gemini-2.5-flash` in `ai-service/app.py`.
- **Reason:** The `gemini-1.5-flash` model has been retired by Google and is no longer available via the API. `gemini-2.0-flash` was tried first but its free-tier daily quota was exhausted. `gemini-2.5-flash` is the current recommended successor.
