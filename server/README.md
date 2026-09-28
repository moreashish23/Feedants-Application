# Feedants Backend — Competition Details Module

Backend for the Feedants "Competition Details Screen" technical assignment. Serves the
"Feedants Classical Dance" competition (and any future competition) dynamically from MongoDB —
nothing about a competition is hardcoded in the frontend.

## Tech Stack

| Layer | Choice | Version |
|---|---|---|
| Runtime | Node.js | **20.20.2** (engines pinned to `>=20 <21`) |
| Framework | Express.js | 4.19.2 |
| Language | TypeScript (strict) | 5.5.4 |
| Database | MongoDB + Mongoose | mongoose 8.5.3 |
| Validation | Zod | 3.23.8 |
| Auth | jsonwebtoken | 9.0.2 |
| Security | helmet, cors, express-rate-limit | 7.1.0 / 2.8.5 / 7.4.0 |
| Logging | morgan | 1.10.0 |
| Dev runner | tsx | 4.16.5 |

All versions above are exact-pinned (no `^`/`~`) and were installed and compiled against Node 20.x
compatibility — no package here requires Node 22+, and none are experimental or deprecated.

### Why these dependencies
- **mongoose 8.x** — modern TS-friendly typings, atomic `findOneAndUpdate` support used for
  concurrency-safe registration, actively maintained, supports Node 20.
- **zod** — schema validation with good TS inference, no code-gen step, small and stable.
- **jsonwebtoken** — the standard, stable JWT library; used only for the lightweight demo auth.
- **express-rate-limit** — cheap first line of defense on the auth and registration endpoints,
  relevant given the assignment's "thousands of concurrent users" assumption.
- **helmet / cors** — baseline HTTP security headers and CORS for a React Native client.
- **bcryptjs was intentionally NOT added** — there are no passwords in this system (demo auth
  only), so a password-hashing library would be dead weight.

## Project Structure
server/
├── src/
│ ├── config/ env.ts, database.ts
│ ├── controllers/ thin HTTP handlers (parse → call service → respond)
│ ├── middleware/ auth (required/optional), centralized error handler, 404
│ ├── models/ User, Competition, Registration (Mongoose schemas + indexes)
│ ├── routes/ route wiring per resource
│ ├── services/ all business logic lives here
│ ├── validators/ Zod schemas for params/bodies
│ ├── utils/ ApiError, asyncHandler, apiResponse, competitionState
│ ├── types/ shared TS types (AuthenticatedRequest, lifecycle, API envelopes)
│ ├── seed/seed.ts idempotent seed script
│ ├── app.ts Express app assembly (no listening)
│ └── server.ts connects DB, starts HTTP server, graceful shutdown
├── .env.example
├── package.json
├── tsconfig.json
└── README.md


Layering is strict: **routes → controllers → services → models**. Controllers only parse input
(Zod) and shape the response; all business rules (lifecycle, capacity, duplicate checks) live in
`services/`.

## Setup

### 1. Prerequisites
- Node.js **20.20.2** (use `nvm install 20.20.2 && nvm use 20.20.2`)
- A MongoDB connection string (MongoDB Atlas free tier is the fastest path — see below)

### 2. MongoDB Atlas setup (recommended for a 1-day timeline)
1. Create a free cluster at https://www.mongodb.com/cloud/atlas.
2. Under **Database Access**, create a user with a username/password.
3. Under **Network Access**, add `0.0.0.0/0` (or your IP) so the backend can connect.
4. Under **Database → Connect → Drivers**, copy the connection string, e.g.
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/feedants?retryWrites=true&w=majority`
5. Paste it into `.env` as `MONGODB_URI`.

A local `mongod` (standalone, no replica set) also works — this backend does not require a
replica set or MongoDB transactions (see the concurrency section below).

### 3. Install & configure
```bash
cd server
npm install
cp .env.example .env
# edit .env: set MONGODB_URI and JWT_SECRET
```

### 4. Seed the database
```bash
npm run seed
```
Seeds the "Feedants Classical Dance" competition and a demo user
(`demo@feedants.com`). Safe to re-run — it upserts by `title`/`email` rather than inserting
duplicates. Competition dates are generated relative to "now" each time it runs, so
registration is always open right after seeding.

### 5. Run
```bash
npm run dev     # ts-node/tsx watch mode, http://localhost:5000
# or
npm run build && npm start   # compiled production run
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | no (default 5000) | HTTP port |
| `MONGODB_URI` | **yes** | MongoDB connection string |
| `JWT_SECRET` | **yes** | Secret used to sign/verify demo-auth JWTs |
| `JWT_EXPIRES_IN` | no (default `7d`) | JWT expiry |
| `NODE_ENV` | no (default `development`) | `development` \| `production` \| `test` |

## API Endpoints

All responses use a consistent envelope:
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": { "code": "COMPETITION_FULL", "message": "..." } }
```

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | none | Liveness + DB connection state |
| POST | `/api/auth/demo` | none | Find-or-create a demo user, returns `{ user, token }` |
| GET | `/api/competitions/:competitionId` | optional | Full screen payload: competition, availability, lifecycle, userState, serverTime |
| GET | `/api/competitions/:competitionId/winners` | none | Previous winners list |
| POST | `/api/competitions/:competitionId/register` | **required** | Concurrency-safe registration |
| POST | `/api/competitions/:competitionId/submission` | **required** | Create/update a submission |

### POST /api/auth/demo
Body (both fields optional):
```json
{ "name": "Ashish More", "email": "ashish@example.com" }
```
Omit the body entirely to get a single shared default demo user. Pass a distinct `email` to
simulate a different user — this is how you get multiple independent JWTs to test concurrent
registration against the same competition.

### GET /api/competitions/:competitionId
```json
{
  "success": true,
  "data": {
    "competition": { "title": "Feedants Classical Dance", "...": "..." },
    "availability": { "capacity": 20, "registeredCount": 1, "remainingSpots": 19 },
    "lifecycle": { "state": "REGISTRATION_OPEN", "registrationOpen": true, "submissionOpen": false },
    "userState": { "isRegistered": false, "submissionStatus": "NOT_SUBMITTED" },
    "serverTime": "2026-09-27T07:50:00.000Z"
  }
}
```
`userState` reflects the caller's own registration only if a valid `Authorization: Bearer <token>`
header is sent; the endpoint still works anonymously.

## Authentication
`POST /api/auth/demo` issues a JWT (`{ userId, email }` payload). Protected routes read
`Authorization: Bearer <token>`, verify it, and re-fetch the user from MongoDB (so a deleted user
can't act with an old token). The authenticated user id is **never** taken from the request
body/params — always from the verified token — which closes an obvious "register on someone
else's behalf" hole.

Intentionally out of scope, per the assignment: password auth, email verification, OAuth/social
login, password reset, complex RBAC.

## Competition Lifecycle
Computed server-side, on every request, from stored `Date` fields — never stored as a status
string, never trusted from the client:

now < registrationStart → UPCOMING
registrationStart <= now < registrationEnd → REGISTRATION_OPEN
registrationEnd <= now < submissionStart → REGISTRATION_CLOSED
submissionStart <= now < submissionEnd → SUBMISSION_OPEN
submissionEnd <= now < resultDate → SUBMISSION_CLOSED
now >= resultDate → RESULT_DECLARED


`GET /api/competitions/:id` also returns `serverTime` so the React Native client can render an
accurate countdown — but every write endpoint (`register`, `submission`) re-derives the state
itself server-side before accepting the request. A client with a wrong clock, or a malicious
client, cannot register outside the real window.

## Registration Concurrency Strategy (the core requirement)

**Problem:** capacity = 20, registeredCount = 19, two requests arrive at the same instant. Naively
doing "read registeredCount → check < capacity → write" as separate steps is a classic
check-then-act race: both requests can read 19, both pass the check, both write, and the
competition ends up over capacity.

**Solution — two atomic, single-document MongoDB operations, no distributed transaction needed:**

1. **Atomic capacity reservation.** The check and the increment happen as *one* MongoDB command:
```ts
   Competition.findOneAndUpdate(
     { _id, $expr: { $lt: ['$registeredCount', '$capacity'] } },
     { $inc: { registeredCount: 1 } },
     { new: true }
   )
```
   MongoDB guarantees single-document writes are atomic. If two requests race, MongoDB
   serializes them internally — only one can match `registeredCount < capacity` and apply its
   `$inc` before the other's filter is (re-)evaluated. The loser gets `null` back and the
   service returns `409 COMPETITION_FULL`. **registeredCount can never exceed capacity**, no
   matter how many requests arrive simultaneously.

2. **Atomic duplicate prevention.** `Registration` has a **unique compound index** on
   `(competitionId, userId)`. Even if the same user's double-click reaches the server as two
   near-simultaneous requests, only the first `Registration.create()` succeeds; the second fails
   with a MongoDB duplicate-key error (`E11000`), which the service maps to
   `409 ALREADY_REGISTERED`.

3. **Compensating rollback.** If step 1 succeeds (a slot was reserved) but step 2 fails for any
   reason (duplicate, unexpected error), the service immediately runs
   `Competition.updateOne({ _id }, { $inc: { registeredCount: -1 } })` to give the slot back. This
   keeps `registeredCount` accurate even when the two-step process is interrupted midway.

This is deliberately **not** implemented with a multi-document MongoDB transaction
(`session.withTransaction`). Transactions require a replica set, which adds real deployment
complexity that wasn't justified for a 1-day assignment against a single Atlas free-tier cluster
(which does support them, but a local standalone `mongod` does not). Because each operation above
only ever touches **one document**, MongoDB's native single-document atomicity is sufficient for
full correctness — this is the same pattern MongoDB's own docs recommend for inventory/seat-style
counters. A transaction-based version would look almost identical, just wrapping both writes in a
session; it's noted here as the natural next step if this were extended to touch more than one
collection atomically.

**Verified:** the lifecycle/atomicity logic was unit-tested directly (11/11 boundary cases for the
state machine; see Testing below). A live multi-client concurrency run against a real MongoDB
cluster could not be executed inside this sandbox (no outbound MongoDB connectivity available
here) — this should be re-run against your Atlas cluster before submission, e.g. with a small
script that fires N concurrent `POST /register` calls for the same near-full competition and
asserts `registeredCount` never exceeds `capacity`.

## Database Indexes

| Collection | Index | Purpose |
|---|---|---|
| `registrations` | unique compound `{ competitionId: 1, userId: 1 }` | Hard guarantee against duplicate registration, even under concurrency |
| `registrations` | `{ competitionId: 1 }` | Fast "all registrations for a competition" lookups |
| `users` | unique `{ email: 1 }` | Enforce one account per email; fast demo-auth lookup |
| `competitions` | `{ category: 1 }` | Supports future "browse by category" listing without a collection scan |

No indexes were added "just in case" — each one maps to a real query pattern in this service.
