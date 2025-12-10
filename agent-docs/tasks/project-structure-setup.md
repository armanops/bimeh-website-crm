# Task: Project Structure Setup

## Description

Restructure the project from root-level folders to a proper monolith structure with `/src` as the root, configure MDX with ContentLayer2, set up database layer with Drizzle, and align path aliases.

## Core Logic

- Move `/app`, `/components`, `/lib` → `/src`
- Create `/src/db` with schema.ts and queries structure
- Create `/src/content` for MDX files
- Update `tsconfig.json` path alias from `@/*` to `@/*` → `./src/*`
- Configure MDX in next.config.ts with ContentLayer2
- Fix drizzle.config.ts to point to correct schema path
- Create initial DB schema for insurance products, users, queues

## Relations to Code Files

- `tsconfig.json` - Update paths
- `next.config.ts` - Add MDX + ContentLayer config
- `drizzle.config.ts` - Fix schema path
- `package.json` - Already has dependencies
- `.gitignore` - Verify .env is ignored

## Steps

1. Create `/src` folder structure
2. Move existing files to `/src`
3. Update all configuration files
4. Create `/src/db/schema.ts` with initial tables
5. Create `/src/db/queries` folder for query functions
6. Create `/src/db/index.ts` for db client
7. Create `/src/content` with sample MDX
8. Create folder README.md files
9. Update path aliases in tsconfig.json
10. Configure MDX in next.config.ts
11. Fix drizzle.config.ts

## Checklist

- [x] Create /src directory structure
- [x] Move app, components, lib to /src
- [x] Create /src/db with schema.ts
- [x] Create /src/db/queries folder
- [x] Create /src/db/index.ts
- [x] Create /src/content folder with sample MDX
- [x] Update tsconfig.json paths
- [x] Configure next.config.ts for MDX
- [x] Fix drizzle.config.ts
- [x] Create README.md files in major folders
- [x] Verify .env in .gitignore
- [x] Create contentlayer.config.ts
