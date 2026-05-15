const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:4000";
const socketUrl =
  import.meta.env.VITE_SOCKET_URL?.replace(/\/$/, "") || apiBaseUrl;
const appEnv = import.meta.env.VITE_APP_ENV ?? "development";

export const env = {
  apiBaseUrl,
  socketUrl,
  appEnv,
  isDev: appEnv === "development",
  isStaging: appEnv === "staging",
  isProd: appEnv === "production",
} as const;
