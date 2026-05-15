import mongoose from "mongoose";
import { MessageModel } from "../models/message.model.js";
import { UserModel } from "../models/user.model.js";
import { env } from "./env.js";

export async function connectDb(): Promise<void> {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGODB_URI);

  // Drop indexes that no longer exist in schemas (e.g. legacy phoneNumber_1 on users)
  await UserModel.syncIndexes();
  await MessageModel.syncIndexes();

  console.log("MongoDB connected");
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}
