import type { Types } from "mongoose";

export type UserRole = "user" | "admin";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  passwordHash?: string;
  displayName: string;
  role: UserRole;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  displayName: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  displayName?: string;
  email?: string;
}

export interface PaginatedUsers {
  users: IUser[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string, withPassword?: boolean): Promise<IUser | null>;
  create(input: CreateUserInput): Promise<IUser>;
  findPaginated(page: number, limit: number): Promise<PaginatedUsers>;
  updateById(id: string, input: UpdateUserInput): Promise<IUser | null>;
  softDeleteById(id: string): Promise<boolean>;
  countUsers(): Promise<number>;
}
