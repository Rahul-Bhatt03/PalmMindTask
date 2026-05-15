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

Production:

```bash
npm run build
npm start
```

## Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | No | `development` (default) |
| `PORT` | No | HTTP port (default `4000`) |
| `MONGODB_URI` | Yes | Mongo connection string |
| `JWT_SECRET` | Yes | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | No | Token lifetime (default `7d`) |
| `CORS_ORIGIN` | No | Comma-separated origins or `*` (default `*`) |
| `ADMIN_EMAIL` | No | Lowercase email; registration with this address assigns `role: admin` |

Example `.env`:

```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/app
JWT_SECRET=change-me-to-a-long-random-string
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
ADMIN_EMAIL=admin@example.com
```

## Response format

**Success**

```json
{ "success": true, "data": { ... } }
```

**Error**

```json
{ "success": false, "error": { "message": "..." } }
```

## HTTP routes

### Health & stats

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | `{ ok: true }` liveness |
| GET | `/api/stats` | No | `{ users, messages }` (active users only) |

### Auth

| Method | Path | Auth | Body | Description |
|--------|------|------|------|-------------|
| POST | `/api/auth/register` | No | `email`, `password`, `displayName` | Create account; returns `user` + `tokens.accessToken` |
| POST | `/api/auth/login` | No | `email`, `password` | Login; same response shape |

`user` object: `{ id, email, displayName, role }` — never includes `passwordHash`.

### Users

All user routes are under `/api/users`. Send `Authorization: Bearer <jwt>`.

| Method | Path | Who can access | Description |
|--------|------|----------------|-------------|
| GET | `/me` | Authenticated | Current user profile |
| GET | `/` | Admin | Paginated list of active users |
| GET | `/:id` | Admin or user with same `id` | Single user |
| PUT | `/:id` | Admin or owner | Partial update |
| DELETE | `/:id` | Admin | Soft delete (sets `deletedAt`) |

**List query params**

| Param | Default | Max | Description |
|-------|---------|-----|-------------|
| `page` | `1` | — | Page number (≥ 1) |
| `limit` | `20` | `100` | Items per page |

**List response (`data`)**

```json
{
  "users": [
    {
      "id": "...",
      "email": "user@example.com",
      "displayName": "Alex",
      "role": "user",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 42,
  "totalPages": 3
}
```

**PUT body** — at least one field required; unknown fields → `400`:

```json
{ "displayName": "New Name", "email": "new@example.com" }
```

Cannot update: `passwordHash`, `role`, `deletedAt`, or other internal fields.

**DELETE response**

```json
{ "deleted": true }
```

Rules:

- Admins cannot delete their own account (`400`).
- Deleted users are excluded from login, list, and stats counts.
- Duplicate email on update → `409`.

### Chat

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/chat/messages?roomId=` | No | Messages in room, oldest first |
| POST | `/api/chat/messages` | Bearer | Body: `{ roomId, body }` (body max 4000 chars) |

## User model (MongoDB)

| Field | Notes |
|-------|--------|
| `email` | Unique, lowercase |
| `passwordHash` | bcrypt; excluded from queries by default |
| `displayName` | Required |
| `role` | `user` \| `admin` (default `user`) |
| `deletedAt` | `null` or date (soft delete) |
| `createdAt` / `updatedAt` | Timestamps |

## Socket.IO

Connect with CORS aligned to `CORS_ORIGIN`. Authenticate with JWT:

- `auth: { token: "<jwt>" }`, or
- `query.token=<jwt>`

### Client → server

| Event | Payload | Notes |
|-------|---------|--------|
| `join_room` | room id `string` | Subscribe socket to room; others get `user:joined` |
| `chat:message` | `{ roomId, body }` | Persists and broadcasts; optional ack `(res) => void` with `{ ok, id?, error? }` |

### Server → client

| Event | Payload |
|-------|---------|
| `chat:message` | `{ id, roomId, senderId, body, createdAt }` |
| `user:joined` | `{ userId, email, roomId }` |

## Project layout

```
src/
├── app.ts              # Express app + route mounting
├── server.ts           # Bootstrap, DI wiring
├── config/             # env, db, socket, cors
├── routes/
├── controllers/
├── services/
├── repositories/
├── models/
├── middlewares/        # auth, admin, validate, error
├── sockets/
├── interfaces/
└── utils/              # jwt, hash, response, user.mapper
```

Layered flow: **routes → controllers → services → repositories → models**.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | `tsx watch` development server |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled `dist/server.js` |
