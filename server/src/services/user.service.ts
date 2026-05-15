import type { IUserService, PaginatedPublicUsers } from "../interfaces/services/user.service.interface.js";
import type {
  IUserRepository,
  UpdateUserInput,
} from "../interfaces/repositories/user.repository.interface.js";
import type { PublicUser } from "../utils/user.mapper.js";
import { toPublicUser } from "../utils/user.mapper.js";

export class UserService implements IUserService {
  constructor(private readonly users: IUserRepository) {}

  async getProfile(userId: string): Promise<PublicUser> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }
    return toPublicUser(user);
  }

  async listUsers(
    requesterId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedPublicUsers> {
    await this.assertAdmin(requesterId);
    const result = await this.users.findPaginated(page, limit);
    return {
      users: result.users.map(toPublicUser),
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    };
  }

  async getUserById(requesterId: string, targetId: string): Promise<PublicUser> {
    const user = await this.users.findById(targetId);
    if (!user) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }
    const isSelf = requesterId === targetId;
    if (!isSelf) {
      await this.assertAdmin(requesterId);
    }
    return toPublicUser(user);
  }

  async updateUser(
    requesterId: string,
    targetId: string,
    input: UpdateUserInput,
  ): Promise<PublicUser> {
    const isSelf = requesterId === targetId;
    if (!isSelf) {
      await this.assertAdmin(requesterId);
    }

    if (!input.displayName && !input.email) {
      throw Object.assign(new Error("No valid fields to update"), { status: 400 });
    }

    if (input.email) {
      const existing = await this.users.findByEmail(input.email);
      if (existing && existing._id.toString() !== targetId) {
        throw Object.assign(new Error("Email already registered"), { status: 409 });
      }
    }

    const updated = await this.users.updateById(targetId, {
      ...(input.displayName !== undefined ? { displayName: input.displayName.trim() } : {}),
      ...(input.email !== undefined ? { email: input.email.toLowerCase().trim() } : {}),
    });

    if (!updated) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }
    return toPublicUser(updated);
  }

  async deleteUser(requesterId: string, targetId: string): Promise<void> {
    await this.assertAdmin(requesterId);

    if (requesterId === targetId) {
      throw Object.assign(new Error("Cannot delete your own account"), { status: 400 });
    }

    const deleted = await this.users.softDeleteById(targetId);
    if (!deleted) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }
  }

  private async assertAdmin(userId: string): Promise<void> {
    const actor = await this.users.findById(userId);
    if (!actor || (actor.role ?? "user") !== "admin") {
      throw Object.assign(new Error("Forbidden"), { status: 403 });
    }
  }
}
