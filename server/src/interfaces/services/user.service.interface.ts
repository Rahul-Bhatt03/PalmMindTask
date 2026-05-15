import type { IUser } from "../repositories/user.repository.interface.js";

export interface IUserService {
  getProfile(userId: string): Promise<Pick<IUser, "email" | "displayName" | "createdAt"> & { id: string }>;
}
