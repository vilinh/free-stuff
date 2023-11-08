import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    base64: {
      type: String,
      default: "",
    },
    name: {
      type: String,
    },
  },
  { collection: "images" },
);

export default mongoose.model("Image", ImageSchema);
