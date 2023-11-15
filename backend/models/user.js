import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    display_name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
    },
    claimed_listings: {
      type: [String],
      default: []
    }
  },
  { collection: "users_list" },
);

export default mongoose.model("User", UserSchema);
