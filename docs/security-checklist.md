# Security Checklist (Industry Standard)

- [x] bcrypt hashing with `BCRYPT_SALT_ROUNDS >= 12`
- [x] JWT access token short TTL (`15m`) + refresh rotation
- [x] Refresh token hashed in DB
- [x] Refresh token via secure HTTP-only cookie
- [x] CSRF middleware enabled for state-changing requests
- [x] Helmet security headers + CSP support
- [x] MongoDB injection prevention (`express-mongo-sanitize`)
- [x] Parameter pollution prevention (`hpp`)
- [x] Input validation and sanitization (Joi)
- [x] Rate limiting on login and AI routes (Redis + fallback)
- [x] Role-based middleware
- [x] CORS allowlist with credentials
- [x] Centralized request logging with request ID
- [x] Backend-only payment verification
- [x] No secrets in source; `.env` enforced in config
- [x] HTTPS-only cookies in production

## Recommended Additions Before Go-Live

- [ ] WAF at edge (Cloudflare/AWS)
- [ ] SAST + dependency scanning CI gate
- [ ] Secret rotation automation
- [ ] SIEM integration for anomaly alerts
- [ ] Penetration test before launch
