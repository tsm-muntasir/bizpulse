# Smart Study Partner AI

Production-grade AI-powered Study Planner SaaS for university students (IUBAT, University of Dhaka, North South University), built for Web (Next.js) + Mobile (Expo) with a secure Node.js backend.

## Monorepo Structure

- `backend/` Express + MongoDB + Redis secure REST API
- `web/` Next.js + Bootstrap responsive dashboard
- `mobile/` Expo React Native app with secure token storage and push notifications
- `docs/` architecture, schema, deployment, security, roadmap

## Quick Start

1. Copy `backend/.env.example` to `backend/.env` and fill secrets.
2. Run services with Docker: `docker compose up --build`.
3. Start backend only: `cd backend && npm install && npm run dev`.

## Required Deliverables

All required outputs are implemented in code and documentation:

- Backend architecture and folder structure: `docs/backend-structure.md`
- Database schema design: `docs/database-design.md`
- Secure auth (JWT + refresh rotation): `backend/src/services/authService.js`
- AI integration with structured JSON + fallback: `backend/src/services/aiService.js`
- Payment verification logic: `backend/src/services/paymentService.js`
- Deployment guide: `docs/deployment-guide.md`
- Security checklist: `docs/security-checklist.md`
- Step-by-step roadmap: `docs/implementation-roadmap.md`
