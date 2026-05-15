export const API_PATHS = {
  auth: {
    register: "/api/auth/register",
    login: "/api/auth/login",
  },
  users: {
    root: "/api/users",
    me: "/api/users/me",
    byId: (id: string) => `/api/users/${id}`,
  },
  chat: {
    messages: "/api/chat/messages",
  },
  stats: "/api/stats",
  health: "/health",
} as const;

export const SOCKET_EVENTS = {
  joinRoom: "join_room",
  chatMessage: "chat:message",
  userJoined: "user:joined",
} as const;

export const DEFAULT_ROOMS = [
  { id: "general", label: "General", description: "Company-wide discussion" },
  { id: "random", label: "Random", description: "Off-topic and fun" },
  { id: "support", label: "Support", description: "Help and questions" },
] as const;

export const AUTH_STORAGE_KEY = "intern_task_auth";
