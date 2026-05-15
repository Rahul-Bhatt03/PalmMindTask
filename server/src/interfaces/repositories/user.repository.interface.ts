import type { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  passwordHash?: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  displayName: string;
}

export interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string, withPassword?: boolean): Promise<IUser | null>;
  create(input: CreateUserInput): Promise<IUser>;
  countUsers(): Promise<number>;
}
