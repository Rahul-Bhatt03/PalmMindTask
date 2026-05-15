# InternTask Frontend

Production-ready React chat client for the InternTask backend.

## Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Redux Toolkit (auth state + persistence)
- React Router DOM 6
- Axios (REST)
- Socket.IO Client (real-time)
- React Hook Form + Zod

## Quick start

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at **http://localhost:3000**. Ensure the backend is on **http://localhost:4000** with `CORS_ORIGIN=http://localhost:3000`.

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | REST API base (default `http://localhost:4000`) |
| `VITE_SOCKET_URL` | Socket.IO URL (defaults to API base) |
| `VITE_APP_ENV` | `development` \| `staging` \| `production` |

### Staging / production

```bash
# .env.staging
VITE_API_BASE_URL=https://api-staging.example.com
VITE_SOCKET_URL=https://api-staging.example.com
VITE_APP_ENV=staging
```

```bash
# Build for staging
npm run build -- --mode staging
```

Create `.env.staging` and `.env.production` alongside `.env.example` when deploying.

## Folder structure

```
src/
├── api/           # Axios client + interceptors
├── services/      # REST API abstractions
├── sockets/       # Socket.IO client + chat events
├── features/      # Feature modules (auth, chat)
├── pages/         # Route-level pages
├── layouts/       # Auth / main layouts
├── hooks/         # Shared hooks (auth, socket, scroll)
├── routes/        # Router + guards
├── store/         # Redux auth slice
├── types/         # DTOs and shared types
├── lib/           # env, cn, storage helpers
├── utils/         # errors, mappers
├── constants/     # paths, socket events, rooms
├── context/       # App providers
├── components/    # Shared UI primitives
└── styles/        # Tailwind entry
```

## How the frontend talks to the backend

| Concern | Mechanism |
|---------|-----------|
| Register / login | `POST /api/auth/register`, `POST /api/auth/login` via Axios |
| Message history | `GET /api/chat/messages?roomId=` |
| Stats sidebar | `GET /api/stats` |
| Live messages | Socket `chat:message` emit → server broadcast |
| Join room | Socket `join_room` |
| User joined | Socket `user:joined` (server emits on join) |
| Auth | JWT in `Authorization: Bearer` + `auth.token` on socket |

## Architecture notes

- **Feature modules** colocate UI, schemas, and exports under `features/<name>/`.
- **Services** wrap HTTP; **sockets** wrap WebSocket events — pages/hooks orchestrate both.
- **Redux** holds auth only; chat state is local to `ChatPage` + socket callbacks.
- **Protected routes** redirect unauthenticated users; **guest routes** redirect logged-in users away from login/register.
- **Token persistence** in `localStorage` via auth slice; Axios reads token via `setTokenGetter`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server (port 3000) |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |

## Recommended practices

- Add RTK Query later for cacheable REST (messages, stats) if the app grows.
- Extract room list from API when rooms become dynamic.
- Add E2E tests (Playwright) for auth + send/receive flows.
- Use error boundaries at layout level for production.
