import listingModel from "../models/listing.js";

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

export {
  updateListingById,
  deleteListingById,
  findListingById,
  findListingByUId,
  addListing,
};
