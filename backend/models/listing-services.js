import mongoose from "mongoose";
import listingModel from "./listing.js";

mongoose
  .connect("mongodb://127.0.0.1:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

async function getListings() {
  let result = await listingModel.find();
  return result;
}