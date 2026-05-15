import type { IUser } from "../interfaces/repositories/user.repository.interface.js";

export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export function toPublicUser(user: IUser): PublicUser {
  return {
    id: user._id.toString(),
    email: user.email,
    displayName: user.displayName,
    role: user.role ?? "user",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
