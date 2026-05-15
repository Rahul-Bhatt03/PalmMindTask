import type { IUserService } from "../interfaces/services/user.service.interface.js";
import type { IUserRepository } from "../interfaces/repositories/user.repository.interface.js";

export class UserService implements IUserService {
  constructor(private readonly users: IUserRepository) {}

  async getProfile(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }
    return {
      id: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
    };
  }
}
