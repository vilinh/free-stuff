import express from "express";
import { listingModel } from "../models/listing.js";
import sanitize from "mongo-sanitize";
import haversine from "haversine-distance";
const router = express.Router();

/* This function is called on the front page of the website and returns all listings based on a series of user defined
 * filters as query parameters as follows:
 *
 *      - title:      Searches if title contains keyword, case-insensitive.
 *      - claimed:    A 'True' value lists both claimed and unclaimed listings, otherwise, default is only unclaimed
 *                    listings.
 *      - condition:  Can be any number of the following: 'great', 'good', 'okay', 'poor'. Default is all
 *                    conditions. Multiple query parameters are separated by ','.
 *      - categories: Can be any number of the following: 'clothing', 'furniture', 'electronics', 'home', 'books',
 *                    'games', 'parts', 'outdoor', 'other'. Default is all categories. Multiple query parameters are
 *                    separated by ','.
 *      - sort:       Can be any number of the following: 'earliest', 'latest', 'title', 'location', 'condition',
 *                    'claimed'. Default is 'latest'. Multiple query parameters are separated by ','.
 *      - index:      Number of results shown. Default is 100.
 *      - offset:     Starting point of results shown. Default is 0.
 */
router.get("/", async (req, res) => {
  const title = req.query["title"];
  const claimed = req.query["claimed"];
  const condition = req.query["condition"]; // Internally represented in the db by 0:'great', 1:'good', 2:'okay', 3:'poor'
  const categories = req.query["categories"];
  const sort = req.query["sort"];
  const index = req.query["index"];
  const offset = req.query["offset"];

  //TODO:Not operational yet, but will be
  const location = req.query["location"];
  const radius = req.query["radius"];

  try {
    const result = await getListings(
      title,
      claimed,
      condition,
      categories,
      location,
      radius,
      sort,
      offset,
      index,
    );
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in the server.");
  }
});

/* This function returns a listing given a listing id */
router.get("/:id", async (req, res) => {
  const id = req.params["id"];
  let result = await findListingById(id);
  if (result == undefined || result.length == 0) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(200).send(result);
  }
});

/* This function returns all listings belonging to a user id */
router.get("/user/:id", async (req, res) => {
  const uid = req.params["id"];
  let result = await findListingByUId(uid);
  if (result == undefined || result.length == 0) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(200).send(result);
  }
});

/* This function adds a listing based on the listing template */
router.post("/", async (req, res) => {
  const listing = new listingModel(req.body);
  let result = await addListing(listing);
  if (result === undefined) {
    res.status(500).send("An error occurred in the server.");
  } else {
    res.status(201).send(listing);
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params["id"];
  const result = await deleteListingById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(204).end();
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params["id"];
  const result = await updateListingById(id, req.body);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(204).end();
  }
});

/* Gets passed user location and max distance(m) and returns listing within that distance */
router.post("/distance-search", async (req, res) => {
  try {
    const max_dist = req.body.max_dist;
    const user_coords = {
      lat: req.body.location.latitude,
      lon: req.body.location.longitude,
    };
    let result = await listingModel.find().limit(10);
    const output = result.filter((listing) => {
      const listing_coords = {
        lat: listing.location.latitude,
        lon: listing.location.longitude,
      };
      const dist = haversine(user_coords, listing_coords);
      console.log(dist);
      return dist <= max_dist ? true : false;
    });
    res.status(200).send(output);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occured in the system");
  }
});

async function getListings(
  title,
  claimed,
  condition,
  categories,
  location,
  radius,
  sort,
  offset,
  index,
) {
  let query = {};
  let match = [];
  let sort_by = {};

  /* These are all query filters */
  if (title && title !== "") {
    match.push({ title: new RegExp(sanitize(title), "i") });
  }
  if (claimed) {
    match.push({ claimed: claimed });
  } else {
    match.push({ claimed: false });
  }
  if (condition) {
    let conds = [];
    for (let s of sanitize(condition).split(",")) {
      switch (s) {
        case "great":
          conds.push("0");
          break;
        case "good":
          conds.push("1");
          break;
        case "okay":
          conds.push("2");
          break;
        case "poor":
          conds.push("3");
          break;
      }
    }
    match.push({
      $expr: { $in: [{ $toString: "$details.condition" }, conds] },
    });
  }
  if (categories) {
    match.push({
      "details.categories": { $in: sanitize(categories).split(",") },
    });
  }
  //TODO:Add address verification and location here -- using an external tool almost certainly
  if (match.length > 0) {
    query = { $and: match };
  }

  /* These are all sort parameters */
  if (!sort) {
    sort_by["details.posted_date"] = -1;
  } else {
    for (let s of sanitize(sort).split(",")) {
      if (s === "earliest") {
        sort_by["details.posted_date"] = 1;
      }
      if (s === "latest") {
        sort_by["details.posted_date"] = -1;
      }
      if (s === "title") {
        sort_by["title"] = 1;
      }
      if (s === "condition") {
        sort_by["details.condition"] = 1;
      }
      if (s === "claimed") {
        sort_by["claimed"] = 1;
      }
    }
  }
  /* Other stuff */
  if (!index) {
    index = 100;
  }
  if (!offset) {
    offset = 0;
  }
  if (
    !Number.isInteger(Number(index)) ||
    !Number.isInteger(Number(offset)) ||
    index < 0 ||
    offset < 0
  ) {
    throw new Error("index, offset must both be non-negative integer values");
  }
  let result = await listingModel
    .find(query)
    .collation({ locale: "en" })
    .sort(sort_by)
    .skip(offset)
    .limit(index);
  return result;
}

async function deleteListingById(id) {
  try {
    return await listingModel.findByIdAndDelete(id);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function findListingById(id) {
  try {
    return await listingModel.findById(id);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function updateListingById(id, listing) {
  try {
    return await listingModel.findByIdAndUpdate(id, listing);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function findListingByUId(uid) {
  try {
    return await listingModel.find({ user_id: uid });
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function addListing(listing) {
  try {
    return await listing.save();
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export default router;
export {
  getListings,
  deleteListingById,
  findListingById,
  findListingByUId,
  addListing,
};
