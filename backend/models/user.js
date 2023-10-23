import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    display_name: {
      type: String,
      default: "",
    },
    user_name: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
    },
  },
  { collection: "users_list" }
);

export default mongoose.model("User", UserSchema);
