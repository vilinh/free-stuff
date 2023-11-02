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
        required: true,
      },
      latitude: {
        type: Number
      },
      longitude: {
        type: Number
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

const listingModel = mongoose.model("Listing", ListingSchema);

export {listingModel};
