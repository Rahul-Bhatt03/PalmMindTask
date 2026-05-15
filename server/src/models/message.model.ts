import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    roomId: { type: String, required: true, index: true, trim: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true, trim: true, maxlength: 4000 },
  },
  { timestamps: true },
);

export const MessageModel = mongoose.model("Message", messageSchema);
