import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export interface TokenClaims {
  sub: string;
  email: string;
}

export function signToken(claims: TokenClaims): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    subject: claims.sub,
  };
  return jwt.sign({ email: claims.email }, env.JWT_SECRET, options);
}

export function verifyToken(token: string): TokenClaims {
  const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload & {
    email?: string;
  };
  return {
    sub: String(decoded.sub ?? ""),
    email: String(decoded.email ?? ""),
  };
}
