# Complete Database Schema Design

## Users
- Identity and access account (email unique, role, status)
- Indexed fields: `email`, `role`
- Security: `passwordHash` excluded by default

## Subjects
- Owned by user
- Fields: subject metadata + exam date + weekly target hours
- Indexes: `(userId, name)` unique, `examDate`

## StudyPlans
- Owned by user and tied to one subject
- Stores AI output tasks (embedded for retrieval speed)
- Fields for AI provenance (`source`, `aiModel`, `generationPromptHash`)
- Indexes: `(userId, subjectId, createdAt)`

## Flashcards
- Owned by user and subject
- Supports spaced repetition fields (`nextReviewAt`, `easeFactor`, `reviewCount`)
- Indexes: `(userId, subjectId, createdAt)` and `nextReviewAt`

## Progress
- Daily progress per user + subject
- Stores completion, accuracy, weakness topics, streak
- Unique index: `(userId, subjectId, date)`

## Subscriptions
- One active subscription profile per user
- Tracks plan, provider, status, AI quota and consumption
- Unique index: `userId`

## Payments
- Immutable payment records with provider IDs
- Verification status updated only by backend
- Unique index: `providerPaymentId`

## ActivityLogs
- User action logs for audit and analytics
- Indexes: `(userId, createdAt)`, `action`

## RefreshTokens
- Rotation and replay-defense token store
- Hashes refresh token at rest
- Fields: `jti`, `expiresAt`, revoke metadata
- Indexes: `jti` unique, `(userId, jti)`, `expiresAt`
