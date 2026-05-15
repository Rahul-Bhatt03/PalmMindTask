import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    displayName: { type: String, required: true, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model("User", userSchema);
