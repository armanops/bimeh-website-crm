# Docker Setup for BIM760

## Overview

Set up Docker and Docker Compose for the BIM760 Next.js application with PostgreSQL database, making it production-ready with proper build scripts, health checks, and environment handling.

## Core Logic

- Create multi-stage Dockerfile for optimized production builds
- Set up docker-compose.yml with app and db services
- Update package.json with Docker-friendly build scripts
- Include database health checks and initialization
- Use environment variables from .env file
- Ensure production optimizations like non-root user and minimal image size

## Relations to Code Files

- `package.json`: Update scripts for Docker builds
- `.env.example`: Reference for environment variables
- `drizzle.config.ts`: Database configuration
- `src/scripts/seed-super-admin.ts`: Admin seeding script
- `src/scripts/create-db.ts`: Database creation script

## Steps

1. Create Dockerfile with multi-stage build
2. Create docker-compose.yml with app and postgres services
3. Update package.json scripts for Docker
4. Add database health check and initialization
5. Ensure production readiness (security, optimization)

## Checklist

- [x] Create Dockerfile
- [x] Create docker-compose.yml
- [x] Update package.json build scripts
- [x] Add database checks and seeding
- [x] Test production readiness
