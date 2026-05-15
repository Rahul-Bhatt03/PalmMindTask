# InternTask — Real-Time Chat Platform

Full-stack TypeScript chat application: Express + MongoDB + Socket.IO backend and a React + Vite frontend with live messaging, JWT auth, user management, and a mobile-friendly UI.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 18+ |
| Language | TypeScript (ES modules) |
| HTTP | Express 4 |
| Database | MongoDB + Mongoose 8 |
| Real-time | Socket.IO 4 |
| Auth | JWT (`jsonwebtoken`) + bcrypt password hashing |
| Frontend | React 18, Vite 5, Tailwind CSS, Redux Toolkit |
| Dev | `tsx` (server watch), Vite HMR (frontend) |

## Features

### Authentication & users

- **Register / login** — Email, password, and display name; passwords hashed with bcrypt; JWT returned on success.
- **Roles** — `user` (default) or `admin`. Set `ADMIN_EMAIL` in server `.env` so that email gets `admin` on register.
- **Current profile** — `GET /api/users/me` (Bearer).
- **List users** — `GET /api/users?page=&limit=` — admin only, paginated, no `passwordHash`.
- **Get user** — `GET /api/users/:id` — admin or the user themselves.
- **Update user** — `PUT /api/users/:id` — owner or admin; only `displayName` and `email` (protected fields rejected).
- **Delete user** — `DELETE /api/users/:id` — admin only; soft delete via `deletedAt`.

### Chat (REST + real-time)

- **Message history** — `GET /api/chat/messages?roomId=`
- **Send message** — `POST /api/chat/messages` (Bearer)
- **Socket.IO** — JWT on connect; `join_room`, `chat:message` with optional ack; live broadcast per room

### Frontend

- Chat with room sidebar (drawer on mobile), live feed, activity log, stats
- **Profile** (`/profile`) — edit display name and email
- **User management** (`/users`) — admin-only list, pagination, delete
- Responsive layout (mobile drawer, compact header, stacked forms)

### Operations

- `GET /health` — liveness
- `GET /api/stats` — user and message counts (non-deleted users)
- Consistent JSON: `{ success: true, data }` / `{ success: false, error: { message } }`

## Repository layout

```
InternTask/
├── LICENSE
├── README.md
├── frontend/          # React + Vite client (see frontend/README.md)
└── server/            # Express + Socket.IO API (see server/README.md)
```

## Quick start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd server
cp .env.example .env
# Set MONGODB_URI, JWT_SECRET, CORS_ORIGIN=http://localhost:3000
# Optional: ADMIN_EMAIL=admin@example.com
npm install
npm run dev
```

API default: **http://localhost:4000**

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

UI default: **http://localhost:3000**

### Production build

```bash
cd server && npm run build && npm start
cd frontend && npm run build   # output in frontend/dist
```

## Environment variables (server)

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port (default `4000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `CORS_ORIGIN` | Allowed origins (comma-separated) or `*` |
| `ADMIN_EMAIL` | Optional; register with this email → `admin` role |

See [server/.env.example](server/.env.example).

## API overview

| Method | Path | Auth | Access | Description |
|--------|------|------|--------|-------------|
| GET | `/health` | — | Public | Liveness |
| POST | `/api/auth/register` | — | Public | Register |
| POST | `/api/auth/login` | — | Public | Login |
| GET | `/api/users/me` | Bearer | Self | Current user |
| GET | `/api/users` | Bearer | Admin | Paginated users (`?page=1&limit=20`) |
| GET | `/api/users/:id` | Bearer | Admin or self | User by ID |
| PUT | `/api/users/:id` | Bearer | Admin or owner | Update `displayName`, `email` |
| DELETE | `/api/users/:id` | Bearer | Admin | Soft delete user |
| GET | `/api/chat/messages?roomId=` | — | Public | List messages |
| POST | `/api/chat/messages` | Bearer | User | Create message |
| GET | `/api/stats` | — | Public | User & message counts |

### Example: admin user flow

```bash
# Register admin (if ADMIN_EMAIL=admin@example.com in .env)
curl -s -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"secret123","displayName":"Admin"}'

# Login and save TOKEN from data.tokens.accessToken
curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"secret123"}'

# List users (admin)
curl -s "http://localhost:4000/api/users?page=1&limit=20" \
  -H "Authorization: Bearer TOKEN"

# Update own profile
curl -s -X PUT http://localhost:4000/api/users/USER_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"displayName":"Alex Updated","email":"alex@example.com"}'
```

More detail: [server/README.md](server/README.md) (HTTP + Socket.IO), [frontend/README.md](frontend/README.md) (UI + client integration).

## Changelog

| Milestone | Summary |
|-----------|---------|
| Initial | Repository and MIT license |
| Server v1 | Auth, chat REST + Socket.IO, stats, layered architecture |
| Users API | CRUD-style user routes, roles, soft delete, admin middleware |
| Frontend v1 | Chat UI, auth, profile, admin users page, responsive layout |

## License

[MIT License](LICENSE) — Copyright (c) 2026 Rahul-Bhatt03.
