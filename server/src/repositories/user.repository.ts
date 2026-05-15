import { UserModel } from "../models/user.model.js";
import type {
  CreateUserInput,
  IUser,
  IUserRepository,
} from "../interfaces/repositories/user.repository.interface.js";

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<IUser | null> {
    const doc = await UserModel.findById(id).lean();
    return doc as IUser | null;
  }

  async findByEmail(email: string, withPassword = false): Promise<IUser | null> {
    const q = UserModel.findOne({ email: email.toLowerCase() });
    if (withPassword) {
      q.select("+passwordHash");
    }
    const doc = await q.lean();
    return doc as IUser | null;
  }

  async create(input: CreateUserInput): Promise<IUser> {
    const doc = await UserModel.create(input);
    const obj = doc.toObject();
    return { ...obj, _id: doc._id } as IUser;
  }

  async countUsers(): Promise<number> {
    return UserModel.countDocuments();
  }
}
