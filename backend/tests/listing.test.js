import { listingModel } from "../models/listing.js";
import {
  getListings,
  deleteListingById,
  findListingById,
  findListingByUId,
  addListing,
} from "../routes/listing.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listing_example_data from "./data/listing_example_data.json";
import filter_1 from "./data/filter_1.json";
import filter_2 from "./data/filter_2.json";
import filter_3 from "./data/filter_3.json";
import filter_4 from "./data/filter_4.json";
import filter_5 from "./data/filter_5.json";
import filter_6 from "./data/filter_6.json";

dotenv.config();

// Please don't run tests on the production database...

let old_db_contents;

beforeAll(async () => {
  await mongoose.connect(process.env.LOCAL_DATABASE_URL).then(() => {
    console.log("Connected to server successfully!");
  });
  old_db_contents = await listingModel.find();
  await listingModel.deleteMany();
  await listingModel.insertMany(listing_example_data);
});

test("get_listings", async () => {
  let result = await getListings();
  result = JSON.stringify(result);
  result = JSON.parse(result);

  await expect(result.length).toBe(listing_example_data.length);
  for (let i = 0; i < result.length; i++) {
    await expect(result[i]).toMatchObject(listing_example_data[i]);
  }
});

test("get_listings_filter_1", async () => {
  let result = await getListings("hi");
  result = JSON.stringify(result);
  result = JSON.parse(result);

  await expect(result.length).toBe(filter_1.length);
  for (let i = 0; i < result.length; i++) {
    await expect(result[i]).toMatchObject(filter_1[i]);
  }
});

test("get_listings_filter_2", async () => {
  let result = await getListings("", "", "great,good");
  result = JSON.stringify(result);
  result = JSON.parse(result);

  await expect(result.length).toBe(filter_2.length);
  for (let i = 0; i < result.length; i++) {
    await expect(result[i]).toMatchObject(filter_2[i]);
  }
});

test("get_listings_filter_3", async () => {
  let result = await getListings("", "", "", "books,clothing");
  result = JSON.stringify(result);
  result = JSON.parse(result);

  await expect(result.length).toBe(filter_3.length);
  for (let i = 0; i < result.length; i++) {
    await expect(result[i]).toMatchObject(filter_3[i]);
  }
});

test("get_listings_filter_4", async () => {
  let result = await getListings("", "", "", "", "", "", "earliest");
  result = JSON.stringify(result);
  result = JSON.parse(result);

  await expect(result.length).toBe(filter_4.length);
  for (let i = 0; i < result.length; i++) {
    await expect(result[i]).toMatchObject(filter_4[i]);
  }
});

test("get_listings_filter_5", async () => {
  let result = await getListings("", "", "", "", "", "", "condition,latest");
  result = JSON.stringify(result);
  result = JSON.parse(result);

  await expect(result.length).toBe(filter_5.length);
  for (let i = 0; i < result.length; i++) {
    await expect(result[i]).toMatchObject(filter_5[i]);
  }
});

test("get_listings_filter_6", async () => {
  let result = await getListings("", "", "", "", "", "", "", 5, 10);
  result = JSON.stringify(result);
  result = JSON.parse(result);

  await expect(result.length).toBe(filter_6.length);
  for (let i = 0; i < result.length; i++) {
    await expect(result[i]).toMatchObject(filter_6[i]);
  }
});

//TODO: Location based filtering...

test("delete_listing_by_id", async () => {
  const listing_to_delete = {
    details: {
      quantity: 1,
      condition: 0,
      categories: ["clothes"],
      posted_date: "2023-01-01T00:00:00.000Z",
    },
    location: {
      address: "12345 Poly Place",
    },
    _id: "6542f9fa0963950be0cd43ea",
    claim_queue: [],
    claimed: false,
    description: "a plain white T-shirt",
    image: "0",
    title: "T-shirt",
    user_id: "0",
    __v: 0,
  };
  await listingModel.insertMany(listing_to_delete);
  await deleteListingById("6542f9fa0963950be0cd43ea");
  let result = await listingModel.find();
  result = JSON.stringify(result);
  result = JSON.parse(result);

  await expect(result).toMatchObject(listing_example_data);

  await listingModel.findByIdAndDelete("6542f9fa0963950be0cd43ea");
});

test("find_listing_by_id", async () => {
  const listing_to_add = {
    details: {
      quantity: 1,
      condition: 0,
      categories: ["clothes"],
      posted_date: "2023-01-01T00:00:00.000Z",
    },
    location: {
      address: "12345 Poly Place",
    },
    _id: "6542f9fa0963950be0cd43ea",
    claim_queue: [],
    claimed: false,
    description: "a plain white T-shirt",
    image: "0",
    title: "T-shirt",
    user_id: "0",
    __v: 0,
  };
  await listingModel.insertMany(listing_to_add);
  let result = await findListingById("6542f9fa0963950be0cd43ea");
  result = JSON.stringify(result);
  result = JSON.parse(result);

  await expect(result).toMatchObject(listing_to_add);

  await listingModel.findByIdAndDelete("6542f9fa0963950be0cd43ea");
});

test("find_listing_by_uid", async () => {
  const listing_to_add = {
    details: {
      quantity: 1,
      condition: 0,
      categories: ["clothes"],
      posted_date: "2023-01-01T00:00:00.000Z",
    },
    location: {
      address: "12345 Poly Place",
    },
    _id: "6542f9fa0963950be0cd43ea",
    claim_queue: [],
    claimed: false,
    description: "a plain white T-shirt",
    image: "0",
    title: "T-shirt",
    user_id: "0",
    __v: 0,
  };
  await listingModel.insertMany(listing_to_add);
  let result = await findListingByUId("0");
  result = JSON.stringify(result);
  result = JSON.parse(result);

  await expect(result).toMatchObject([listing_to_add]);

  await listingModel.findByIdAndDelete("6542f9fa0963950be0cd43ea");
});

test("add_listing", async () => {
  const listing_to_add = {
    details: {
      quantity: 1,
      condition: 0,
      categories: ["clothes"],
      posted_date: "2023-01-01T00:00:00.000Z",
    },
    location: {
      address: "12345 Poly Place",
    },
    _id: "6542f9fa0963950be0cd43ea",
    claim_queue: [],
    claimed: false,
    description: "a plain white T-shirt",
    image: "0",
    title: "T-shirt",
    user_id: "0",
    __v: 0,
  };
  await addListing(new listingModel(listing_to_add));
  let result = await listingModel.find();
  result = JSON.stringify(result);
  result = JSON.parse(result);
  listing_example_data.push(listing_to_add);

  await expect(result).toMatchObject(listing_example_data);

  listing_example_data.pop();
  await listingModel.findByIdAndDelete("6542f9fa0963950be0cd43ea");
});

afterAll(async () => {
  await listingModel.deleteMany();
  await listingModel.insertMany(old_db_contents);
  await mongoose.connection.close();
});
