# InternTask Frontend

Production-ready React chat client for the InternTask backend.

## Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Redux Toolkit (auth state + `localStorage` persistence)
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

- App: **http://localhost:3000**
- API (default): **http://localhost:4000**
- Server `CORS_ORIGIN` must include `http://localhost:3000`

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | REST API base, no trailing slash (default `http://localhost:4000`) |
| `VITE_SOCKET_URL` | Socket.IO URL (defaults to API base when empty) |
| `VITE_APP_ENV` | `development` \| `staging` \| `production` |

### Staging / production

```bash
# .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_SOCKET_URL=https://api.example.com
VITE_APP_ENV=production
```

```bash
npm run build
# or: npm run build -- --mode staging  (uses .env.staging)
```

## Routes

| Path | Guard | Description |
|------|-------|-------------|
| `/` | — | Redirects to `/chat` |
| `/login` | Guest | Sign in |
| `/register` | Guest | Create account |
| `/chat` | Protected | Main chat (rooms, messages, socket) |
| `/profile` | Protected | Edit display name & email |
| `/users` | Protected + Admin | List/delete users (pagination) |
| `*` | — | 404 |

**Admin UI** — `Users` link and `/users` route appear only when `user.role === "admin"` (from login/register response). Grant admin on the server via `ADMIN_EMAIL` at register time.

## Features

### Chat (`/chat`)

- Room sidebar: fixed on `lg+`, slide-in drawer with backdrop on smaller screens (☰ in header)
- Live messages via Socket.IO; history via REST
- Activity feed (`user:joined`, etc.)
- Platform stats (users / messages) in sidebar
- Header: room title, connection badge, avatar menu (mobile) or full nav (desktop)

### Profile (`/profile`)

- Form: `displayName`, `email`
- `PUT /api/users/:id` for the logged-in user
- Redux auth state updated after save

### User management (`/users`)

- `GET /api/users?page=&limit=` (admin only)
- Table on desktop; cards on mobile
- Delete with confirmation (`DELETE /api/users/:id`)

### Responsive behavior

- `100dvh` layout, no horizontal page scroll
- Safe-area padding on message input (notched phones)
- Stacked headers and full-width buttons on narrow viewports
- Viewport meta: `viewport-fit=cover`

## Folder structure

```
src/
├── api/              # Axios client + interceptors
├── services/         # auth, chat, stats, user
├── sockets/          # Socket.IO client + chat events
├── features/
│   ├── auth/         # Login/register forms + Zod schemas
│   ├── chat/         # Header, sidebar, messages, input
│   └── users/        # Profile form, users table
├── pages/            # Route-level pages
├── layouts/          # Auth / main layouts
├── hooks/            # useAuth, useChatSocket, useAutoScroll
├── routes/           # Router, Protected, Guest, Admin guards
├── store/            # Redux auth slice
├── types/            # DTOs and shared types
├── lib/              # env, cn, storage
├── utils/            # errors, mappers
├── constants/        # API paths, socket events, rooms
├── context/          # App providers
├── components/ui/    # Button, Input, Alert, Badge, etc.
└── styles/           # Tailwind entry
```

## Backend integration

| Concern | Client | Endpoint / event |
|---------|--------|-------------------|
| Register | `authService.register` | `POST /api/auth/register` |
| Login | `authService.login` | `POST /api/auth/login` |
| Current user | `userService.getMe` | `GET /api/users/me` |
| List users | `userService.list` | `GET /api/users` |
| Get user | `userService.getById` | `GET /api/users/:id` |
| Update user | `userService.update` | `PUT /api/users/:id` |
| Delete user | `userService.remove` | `DELETE /api/users/:id` |
| Messages | `chatService.getMessages` | `GET /api/chat/messages?roomId=` |
| Stats | `statsService.getStats` | `GET /api/stats` |
| Live chat | `useChatSocket` | `join_room`, `chat:message`, `user:joined` |

### Auth

- JWT stored in `localStorage` (`intern_task_auth`)
- Axios: `Authorization: Bearer <token>` via request interceptor
- Socket: `auth: { token }` on connect
- `401` responses dispatch `auth:unauthorized` for global sign-out handling

### Default rooms

Configured in `constants/index.ts`: `general`, `random`, `support`. Room list is client-side until a rooms API exists.

## Architecture notes

- **Feature modules** colocate UI and schemas under `features/<name>/`.
- **Services** wrap HTTP; **sockets** wrap WebSocket events; pages/hooks orchestrate both.
- **Redux** holds auth only; chat state is local to `ChatPage` + socket callbacks.
- **ProtectedRoute** — requires login; **GuestRoute** — redirects authenticated users away from auth pages; **AdminRoute** — requires `role === "admin"`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server (port 3000) |
| `npm run build` | `tsc -b` + production build → `dist/` |
| `npm run preview` | Preview production build |

## Recommended next steps

- RTK Query for cacheable REST (messages, users, stats)
- Rooms API instead of hard-coded `DEFAULT_ROOMS`
- Playwright E2E for auth, chat, and admin flows
- Error boundaries at layout level
