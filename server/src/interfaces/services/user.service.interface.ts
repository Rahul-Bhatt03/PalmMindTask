import type { UpdateUserInput } from "../repositories/user.repository.interface.js";
import type { PublicUser } from "../../utils/user.mapper.js";

export interface PaginatedPublicUsers {
  users: PublicUser[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IUserService {
  getProfile(userId: string): Promise<PublicUser>;
  listUsers(requesterId: string, page: number, limit: number): Promise<PaginatedPublicUsers>;
  getUserById(requesterId: string, targetId: string): Promise<PublicUser>;
  updateUser(
    requesterId: string,
    targetId: string,
    input: UpdateUserInput,
  ): Promise<PublicUser>;
  deleteUser(requesterId: string, targetId: string): Promise<void>;
}
