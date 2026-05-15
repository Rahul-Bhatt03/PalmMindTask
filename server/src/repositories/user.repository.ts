import { UserModel } from "../models/user.model.js";
import type {
  CreateUserInput,
  IUser,
  IUserRepository,
  PaginatedUsers,
  UpdateUserInput,
} from "../interfaces/repositories/user.repository.interface.js";

const activeFilter = { deletedAt: null };

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<IUser | null> {
    const doc = await UserModel.findOne({ _id: id, ...activeFilter }).lean();
    return doc as IUser | null;
  }

  async findByEmail(email: string, withPassword = false): Promise<IUser | null> {
    const q = UserModel.findOne({ email: email.toLowerCase(), ...activeFilter });
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

  async findPaginated(page: number, limit: number): Promise<PaginatedUsers> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      UserModel.find(activeFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserModel.countDocuments(activeFilter),
    ]);
    return {
      users: users as IUser[],
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async updateById(id: string, input: UpdateUserInput): Promise<IUser | null> {
    const doc = await UserModel.findOneAndUpdate(
      { _id: id, ...activeFilter },
      { $set: input },
      { new: true, runValidators: true },
    ).lean();
    return doc as IUser | null;
  }

  async softDeleteById(id: string): Promise<boolean> {
    const result = await UserModel.updateOne(
      { _id: id, ...activeFilter },
      { $set: { deletedAt: new Date() } },
    );
    return result.modifiedCount > 0;
  }

  async countUsers(): Promise<number> {
    return UserModel.countDocuments(activeFilter);
  }
}
