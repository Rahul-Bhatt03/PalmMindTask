import type { CorsOptions } from "cors";
import { env } from "./env.js";

function parseOrigins(raw: string): string[] | "*" {
  const trimmed = raw.trim();
  if (trimmed === "*") return "*";
  return trimmed
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
}

function createOriginValidator(
  allowed: string[] | "*",
): CorsOptions["origin"] {
  if (allowed === "*") {
    return true;
  }

  const set = new Set(allowed);

  return (origin, callback) => {
    // Same-origin or non-browser clients (curl, Postman)
    if (!origin) {
      callback(null, true);
      return;
    }
    if (set.has(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS: origin not allowed: ${origin}`));
  };
}

const allowedOrigins = parseOrigins(env.CORS_ORIGIN);
const origin = createOriginValidator(allowedOrigins);

export const corsOptions: CorsOptions = {
  origin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Length"],
  maxAge: 86400,
};

export const socketCorsOptions = {
  origin: allowedOrigins === "*" ? true : allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true,
};
