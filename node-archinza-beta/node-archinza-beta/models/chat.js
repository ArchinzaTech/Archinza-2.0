const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PersonalAccount",
    },
    intent: { type: String, defaultValue: "" },
    datetime: { type: Date },
    chats: [{ sender: { type: String }, text: { type: String }, _id: false }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
