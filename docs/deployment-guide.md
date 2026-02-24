# Deployment Guide

## 1. Backend (Render or Railway)

- Build command: `npm install`
- Start command: `npm start`
- Root directory: `backend`
- Add environment variables from `backend/.env.example`
- Enforce HTTPS and set trusted proxy in platform settings
- Configure health check path: `/health`

## 2. Database (MongoDB Atlas)

- Create dedicated project and cluster
- Whitelist backend egress IP/range
- Create DB user with least privilege
- Set `MONGO_URI` with TLS
- Enable backups and alerts

## 3. Redis

- Use managed Redis (Upstash/Redis Cloud)
- Set `REDIS_URL`
- Validate rate limiter behavior in production logs

## 4. Frontend Web (Vercel)

- Root directory: `web`
- Build: `next build`
- Output: default Next.js
- Set `NEXT_PUBLIC_API_BASE_URL`
- Add production origin to backend `CORS_ORIGINS`

## 5. Mobile (Expo EAS)

- Configure API base URL in app config
- Use secure token storage and push credential setup
- Build release with EAS for Android/iOS

## 6. Payments

- Stripe: webhook endpoint `/api/v1/payments/stripe/webhook`
- bKash/Nagad: verify callbacks in backend; never trust frontend status
- Store provider IDs + verification metadata in `payments`

## 7. Post-deploy validation

- Test auth: login, refresh rotation, logout
- Test rate limits on login and AI endpoints
- Run OWASP ZAP baseline scan
- Verify CSRF and CORS behavior
- Verify logs and alerting
