# Utilities & Helpers

Shared utility functions and helpers for the application.

## Files

- `utils.ts` - General utilities (e.g., `cn()` for className merging)
- `auth.ts` - Authentication helpers (NextAuth)
- `db.ts` - Database client utilities
- `openai.ts` - OpenAI API helpers
- `format.ts` - Formatting helpers (prices, dates, etc.)

## Usage

Import from `@/lib/[filename]`:

```typescript
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
```
