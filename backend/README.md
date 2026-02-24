# Backend API (Smart Study Partner AI)

Node.js + Express + MongoDB (Mongoose) backend using Controller-Service-Repository architecture with security-first defaults.

## Security Highlights

- bcrypt hashing with configurable salt rounds (`>=12`)
- Short-lived JWT access tokens + refresh token rotation
- Refresh tokens stored hashed in DB
- HTTP-only refresh cookies
- Helmet, CORS, CSRF, XSS/mongo injection hardening middleware
- Login and AI rate limiting (Redis + memory fallback)
- Role-based access control middleware
- Backend-only payment verification endpoints

## Run

```bash
npm install
cp .env.example .env
npm run dev
```
