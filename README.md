# InternTask — Real-Time Chat Platform

Full-stack TypeScript chat application: Express + MongoDB + Socket.IO backend and a React + Vite frontend with live messaging, JWT auth, and a production-oriented folder structure.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 18+ |
| Language | TypeScript (ES modules) |
| HTTP | Express 4 |
| Database | MongoDB + Mongoose 8 |
| Real-time | Socket.IO 4 |
| Auth | JWT (`jsonwebtoken`) + bcrypt password hashing |
| Dev | `tsx` (watch mode) |

## Features Developed

### Authentication & users

- **Register** — Create an account with email, password, and display name. Passwords are hashed with bcrypt before storage.
- **Login** — Authenticate and receive a JWT access token plus a safe user object (no password hash).
- **Current user profile** — `GET /api/users/me` returns the logged-in user’s profile when a valid Bearer token is sent.

### Chat (REST)

- **List messages** — `GET /api/chat/messages?roomId=<id>` returns messages for a room, ordered by creation time.
- **Send message** — `POST /api/chat/messages` (authenticated) persists a message with `roomId` and `body` (max 4,000 characters).

### Chat (real-time)

- **JWT on connect** — Clients authenticate via `auth.token` or `query.token`.
- **Join room** — `join_room` event subscribes the socket to a room channel.
- **Send & broadcast** — `chat:message` saves the message, broadcasts to everyone in the room, and supports an optional acknowledgment callback `{ ok, id?, error? }`.

### Operations & observability

- **Health check** — `GET /health` for liveness probes.
- **App stats** — `GET /api/stats` returns total user and message counts.
- **Consistent API responses** — Success payloads use `{ success: true, data }`; errors use `{ success: false, error: { message } }`.
- **Centralized error handling** — Global error middleware maps service errors to HTTP status codes.

### Architecture & quality

- **Layered design** — `routes` → `controllers` → `services` → `repositories` → Mongoose `models`.
- **Interfaces** — Service and repository contracts for clearer boundaries and testing.
- **Request validation** — Body validation middleware on auth routes.
- **Auth middleware** — Bearer JWT verification for protected HTTP routes.
- **Environment config** — Typed config from `.env` with an example file (no secrets committed).

## Repository Layout

```
InternTask/
├── LICENSE
├── README.md          ← this file
├── frontend/          ← React + Vite chat client
└── server/            ← Express + Socket.IO API
    ├── .env.example
    ├── package.json
    ├── README.md      ← detailed API & socket reference
    └── src/
        ├── app.ts
        ├── server.ts
        ├── config/     # env, db, socket
        ├── controllers/
        ├── services/
        ├── repositories/
        ├── models/
        ├── routes/
        ├── middlewares/
        ├── sockets/
        ├── interfaces/
        └── utils/
```

## Quick Start

### Prerequisites

- Node.js 18 or newer
- MongoDB running and reachable (local or Atlas)

### Backend

```bash
cd server
cp .env.example .env
# Edit .env — set MONGODB_URI, JWT_SECRET, and CORS_ORIGIN=http://localhost:3000
npm install
npm run dev
```

The API listens on `PORT` (default **4000**).

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The UI runs at **http://localhost:3000**. See [frontend/README.md](frontend/README.md) for architecture, env vars, and Socket.IO usage.

### Production build

```bash
cd server
npm run build
npm start
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port (default `4000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `CORS_ORIGIN` | Allowed browser origin, or `*` |

See [server/.env.example](server/.env.example) for a starter template.

## API Overview

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Liveness check |
| POST | `/api/auth/register` | No | Register (`email`, `password`, `displayName`) |
| POST | `/api/auth/login` | No | Login (`email`, `password`) |
| GET | `/api/users/me` | Bearer | Current user profile |
| GET | `/api/chat/messages?roomId=` | No | List messages in a room |
| POST | `/api/chat/messages` | Bearer | Create message (`roomId`, `body`) |
| GET | `/api/stats` | No | User and message counts |

### Example: register and send a message

```bash
# Register
curl -s -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123","displayName":"Alex"}'

# Login (copy accessToken from response)
curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'

# Post a message (replace TOKEN)
curl -s -X POST http://localhost:4000/api/chat/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"roomId":"general","body":"Hello, world!"}'
```

For Socket.IO event names, payloads, and project internals, see [server/README.md](server/README.md).

## Changelog

| Date / milestone | Summary |
|------------------|---------|
| Initial commit | Repository and MIT license |
| Server release | Full backend: auth, users, chat (REST + Socket.IO), stats, layered TypeScript architecture, `.env.example` |

## License

This project is licensed under the [MIT License](LICENSE) — Copyright (c) 2026 Rahul-Bhatt03.
