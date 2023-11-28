import listingModel from "../models/listing.js";
import {
  deleteListingById,
  findListingById,
  updateListingById,
  findListingByUId,
  addListing,
} from "../services/listing-services";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log("Connected to server successfully!");
  });
});

test("test find listing by id", async () => {
  const result = await findListingById("65585751bfca18273a4a9791");

  expect(result.title).toBe("cats");
  expect(result.user_id).toBe("awbwSHGhSvbA35Msl1OG41nODxO2");
});

test("test find listing by uid", async () => {
  const result = await findListingByUId("nVspFOWRfGbwRdnYu0NP6lJIdEr2");

  expect(result[0].title).toBe("Bookssss");
  expect(result[0].description).toBe("books");
});

test("test add listing", async () => {
  const listing = new listingModel({
    details: {
      quantity: 1,
      condition: 0,
      categories: ["clothes"],
      posted_date: "2023-01-01T00:00:00.000Z",
    },
    location: {
      latlng: {
        type: "Point",
        coordinates: [-120.6982555, 35.7454865],
      },
      address: "San Luis Obispo Rd, San Miguel, CA 93451, USA",
    },
    claim_queue: [],
    claimed: false,
    description: "a plain white T-shirt",
    image: "0",
    title: "T-shirt",
    user_id: "0",
  });
  await addListing(listing);

  const result = await findListingById(listing.id);

  expect(result.title).toBe("T-shirt");
  expect(result.details.quantity).toBe(1);
  await listingModel.findByIdAndDelete(listing.id);
});

test("test update listing by id", async () => {
  const listing = new listingModel({
    details: {
      quantity: 1,
      condition: 0,
      categories: ["clothes"],
      posted_date: "2023-01-01T00:00:00.000Z",
    },
    location: {
      latlng: {
        type: "Point",
        coordinates: [-120.6982555, 35.7454865],
      },
      address: "San Luis Obispo Rd, San Miguel, CA 93451, USA",
    },
    claim_queue: [],
    claimed: false,
    description: "a plain white T-shirt",
    image: "0",
    title: "T-shirt",
    user_id: "0",
  });
  await addListing(listing);
  listing.title = "new listing";

  await updateListingById(listing.id, listing);
  const after_result = await findListingById(listing.id);

  expect(after_result.title).toBe("new listing");
  await listingModel.findByIdAndDelete(listing.id);
});

test("test delete listing by id", async () => {
  const listing = new listingModel({
    details: {
      quantity: 1,
      condition: 0,
      categories: ["clothes"],
      posted_date: "2023-01-01T00:00:00.000Z",
    },
    location: {
      latlng: {
        type: "Point",
        coordinates: [-120.6982555, 35.7454865],
      },
      address: "San Luis Obispo Rd, San Miguel, CA 93451, USA",
    },
    claim_queue: [],
    claimed: false,
    description: "a plain white T-shirt",
    image: "0",
    title: "T-shirt",
    user_id: "0",
  });
  await addListing(listing);
  await deleteListingById(listing.id);

  const after_result = await findListingById(listing.id);

  expect(after_result).toEqual(null);
});

test("test findListingById handles error", async () => {
  const result = await findListingById(83);

  expect(result).toBe(undefined);
});

test("test updateListingById handles error", async () => {
  const result = await updateListingById(83, null);

  expect(result).toBe(undefined);
});

test("test addListing handles error", async () => {
  const result = await addListing({});

  expect(result).toBe(undefined);
});

test("test deleteListingById handles error", async () => {
  const result = await deleteListingById(83);

  expect(result).toBe(undefined);
});

test("test findListingByUId handles error", async () => {
  await mongoose.connection.close();
  const result = await findListingByUId();

  expect(result).toBe(undefined);
});

afterAll(async () => {
  await mongoose.connection.close();
});
