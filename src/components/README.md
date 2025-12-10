# Components

Reusable React components for the application.

## Structure

- `ui/` - shadcn/ui base components
- `admin/` - Admin-specific components (for /admin routes)
- Root level - Feature-specific components

## Guidelines

- One component per file
- Use kebab-case filenames
- Props types in separate `types.ts` file when needed
- Export components and types from component files

## UI Components

Shadcn/ui components from Radix UI primitives.

## Custom Components

Create feature-specific components at the root of `/components` and organize admin components in `/admin`.
