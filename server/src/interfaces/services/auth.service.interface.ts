export interface AuthTokens {
  accessToken: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user: { id: string; email: string; displayName: string };
  tokens: AuthTokens;
}

export interface IAuthService {
  register(input: RegisterInput): Promise<AuthResult>;
  login(input: LoginInput): Promise<AuthResult>;
}
