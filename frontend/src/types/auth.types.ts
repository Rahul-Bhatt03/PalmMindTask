export type UserRole = "user" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthResult {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface RegisterDto {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface PersistedAuth {
  user: AuthUser;
  accessToken: string;
}
