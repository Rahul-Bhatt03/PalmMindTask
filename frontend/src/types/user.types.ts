import type { UserRole } from "./auth.types";

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedUsers {
  users: UserProfile[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UpdateUserDto {
  displayName?: string;
  email?: string;
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
}
