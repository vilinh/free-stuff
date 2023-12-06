import axios from "axios";
import { Condition } from "./enum";
import { getImageFromId } from "./imageService";

const categoryOptions = [
  "Clothes",
  "Furniture",
  "Electronics",
  "Home",
  "Books",
  "Games",
  "Parts",
  "Outdoor",
  "Other",
];

const conditionOptions = [
  { value: Condition.Poor, label: "Poor" },
  { value: Condition.Okay, label: "Okay" },
  { value: Condition.Good, label: "Good" },
  { value: Condition.Great, label: "Great" },
];

async function postListing(listing) {
  try {
    return await axios.post("http://localhost:8000/listing", listing);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function getListingById(id) {
  try {
    return await axios.get(`http://localhost:8000/listing/${id}`);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function getListingsSorted() {
  try {
    return await axios.get(`http://localhost:8000/listing?sort=latest`);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function getListingsByCoordinates(lat, lng) {
  try {
    return await axios.get(
      `http://localhost:8000/listing?latlng=${lat},${lng}&radius=10&sort=location`,
    );
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function updateListingById(id, listing) {
  try {
    return await axios.put(`http://localhost:8000/listing/${id}`, listing);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function deleteListingById(id) {
  try {
    return await axios.delete(`http://localhost:8000/listing/${id}`);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function getListingByDistance(data) {
  try {
    return await axios.post(
      "http://localhost:8000/listing/distance-search",
      data,
    );
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

function loadListings(res, callback) {
  let promises = [];
  if (res) {
    res.data.forEach(async (item) => {
      promises.push(getImageFromId(item.image));
    });
    Promise.all(promises).then((values) => {
      res.data.forEach((item, i) => {
        if (values[i]) {
          item.image = values[i].data.base64;
        }
      });
      callback(res.data);
    });
  } else {
    callback(null);
  }
}

export {
  categoryOptions,
  conditionOptions,
  postListing,
  getListingById,
  updateListingById,
  deleteListingById,
  getListingByDistance,
  getListingsByCoordinates,
  getListingsSorted,
  loadListings,
};
