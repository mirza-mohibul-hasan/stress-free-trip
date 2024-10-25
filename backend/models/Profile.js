const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vlgo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vlog",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
