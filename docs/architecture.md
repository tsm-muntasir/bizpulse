# Architecture Overview

Smart Study Partner AI follows a modular monorepo architecture:

- Backend API (`backend/`): Express REST API using Controller-Service-Repository pattern.
- Web App (`web/`): Next.js client for dashboard and subscription management.
- Mobile App (`mobile/`): Expo app for reminders and study flow on mobile.

## Request Flow

1. Client authenticates and receives access token + refresh cookie.
2. Access token authorizes API calls with RBAC middleware.
3. AI endpoints enforce per-subscription quotas and rate limits.
4. AI output is parsed as structured JSON and stored in MongoDB.
5. Payment callbacks are verified server-side before plan upgrades.

## Scalability for 100k+ users

- Stateless API pods with short-lived JWT access tokens
- Redis-backed rate limiting and cache
- MongoDB Atlas indexed collections and query pagination
- Horizontal scale behind load balancer
- Centralized structured logs and request IDs
