import mongoose from "mongoose";

const condition_vars = ['new', 'great', 'good', 'fair', 'poor']
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
      default: [],
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
      address: {
        type: String,
      },
    },
    description: {
      type: String,
      required: false,
    },
    posted_date: {
      type: Date,
      default: Date.now,
      },
    image: {
      type: String,
    },
  },
  {
      collection: "listings"
  }
);

const listingModel = mongoose.model("Listing", ListingSchema)

export {listingModel, condition_vars, category_vars};
