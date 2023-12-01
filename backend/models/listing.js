import mongoose from "mongoose";

const condition_vars = ["great", "good", "okay", "poor"];
const category_vars = [
  "clothing",
  "furniture",
  "electronics",
  "home",
  "books",
  "games",
  "parts",
  "outdoor",
  "other",
];

const ListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      address: {
        type: String,
      },
      latlng: {
        type: {
          type: String,
          required: true,
        },
        coordinates: {
          type: Array,
          required: true,
        },
      },
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
      default: [],
    },
    details: {
      quantity: {
        type: Number,
      },
      condition: {
        type: Number,
      },
      categories: {
        type: [String],
      },
      posted_date: {
        type: Date,
        default: Date.now(),
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
    collection: "listings",
  },
);

export default mongoose.model("Listing", ListingSchema);
