import axios from "axios";
import { Condition } from "./enum";

const categoryOptions = ["Clothes", "Books", "Furniture"];

const conditionOptions = [
	{ value: Condition.Poor, label: "Poor" },
	{ value: Condition.Okay, label: "Okay" },
	{ value: Condition.Good, label: "Good" },
	{ value: Condition.Great, label: "Great" },
];

async function postListing(listing) {
	try {
		await axios.post("http://localhost:8000/listing", listing);
	} catch (error) {
		console.log(error);

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

async function updateListingById(id, listing) {
	try {
		await axios.put(`http://localhost:8000/listing/${id}`, listing);
	} catch (error) {
		console.log(error);
		return undefined;
	}
}

async function deleteListingById(id) {
	try {
		await axios.delete(`http://localhost:8000/listing/${id}`);
	} catch (error) {
		console.log(error);
		return undefined;
	}
}

export { categoryOptions, conditionOptions, postListing, getListingById, updateListingById, deleteListingById }
