import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    user_id: {
      type: String,
      required: true,
    },
    claimed: {
      type: Boolean,
    },
    claim_queue: {
      type: [String],
    },
    details: {
      quantity: {
        type: Number,
      },
      condition: {
        type: String,
      },
      categories: {
        type: [String],
      },
      posted_date: {
        type: Date,
        default: Date.now,
      },
    },
    description: {
      type: String,
      required: false,
    },
    image: {
      type: String,
    },
  },
  {
      collection: "listings"
  }
);

export default mongoose.model("Listing", ListingSchema);
