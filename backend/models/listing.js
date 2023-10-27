import mongoose from "mongoose";

const condition_vars = ['new', 'gently used', 'good', 'fair', 'poor']
const category_vars = ['clothing', 'furniture', 'electronics', 'home', 'books', 'games', 'parts', 'outdoor', 'other']

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
      address: {
        type: String,
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

export default {ListingSchema, condition_vars, category_vars};