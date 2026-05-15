import type { IAuthService, AuthResult, LoginInput, RegisterInput } from "../interfaces/services/auth.service.interface.js";
import type { IUser, IUserRepository } from "../interfaces/repositories/user.repository.interface.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { signToken } from "../utils/jwt.js";

export class AuthService implements IAuthService {
  constructor(private readonly users: IUserRepository) {}

  async register(input: RegisterInput): Promise<AuthResult> {
    const existing = await this.users.findByEmail(input.email);
    if (existing) {
      throw Object.assign(new Error("Email already registered"), { status: 409 });
    }
    const passwordHash = await hashPassword(input.password);
    const user = await this.users.create({
      email: input.email.toLowerCase(),
      passwordHash,
      displayName: input.displayName,
    });
    return this.toAuthResult(user);
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await this.users.findByEmail(input.email, true);
    if (!user?.passwordHash) {
      throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    }
    const ok = await comparePassword(input.password, user.passwordHash);
    if (!ok) {
      throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    }
    return this.toAuthResult(user);
  }

  private toAuthResult(user: IUser): AuthResult {
    const accessToken = signToken({ sub: user._id.toString(), email: user.email });
    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
      },
      tokens: { accessToken },
    };
  }
}
