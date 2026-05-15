# Server

Express + MongoDB (Mongoose) + Socket.IO API in TypeScript.

## Prerequisites

- Node.js 18+
- MongoDB reachable at `MONGODB_URI`

## Setup

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## Environment

| Variable        | Description                          |
|----------------|--------------------------------------|
| `PORT`         | HTTP port (default `4000`)           |
| `MONGODB_URI`  | Mongo connection string              |
| `JWT_SECRET`   | Secret for signing JWTs              |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`)       |
| `CORS_ORIGIN`  | Allowed browser origin or `*`        |

## HTTP routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Liveness |
| POST | `/api/auth/register` | No | Register |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/users/me` | Bearer | Current user |
| GET | `/api/chat/messages?roomId=` | No | List messages |
| POST | `/api/chat/messages` | Bearer | Create message (`roomId`, `body`) |
| GET | `/api/stats` | No | User and message counts |

## Socket.IO

Connect with the same origin/CORS settings. Authenticate with JWT:

- `auth: { token: "<jwt>" }` or `query.token=<jwt>`

Events:

- `join_room` — payload: room id string
- `chat:message` — `{ roomId, body }` — optional ack callback `{ ok, id?, error? }`
- Server emits `chat:message` to the room with `{ id, roomId, senderId, body, createdAt }`

## Project layout

Layered structure: `routes` → `controllers` → `services` → `repositories` → Mongoose `models`. Shared utilities live under `utils/`; Socket.IO handlers under `sockets/`.
