import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/Auth/AuthContext";
import Selector from "../Selector/Selector";
import { useNavigate } from "react-router-dom";
import Image from "../../imageService";
import { Condition } from "../../enum";
import Autocomplete from "react-google-autocomplete";
import "./CreateListing.css"
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, styled } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InputFileUpload from "../InputFileUpload/InputFileUpload";

const categoryOptions = [
	{ value: "Clothes", label: "Clothes" },
	{ value: "Books", label: "Books" },
	{ value: "Furniture", label: "Furniture" },
];

const conditionOptions = [
	{ value: Condition.Poor, label: "Poor" },
	{ value: Condition.Okay, label: "Okay" },
	{ value: Condition.Good, label: "Good" },
	{ value: Condition.Great, label: "Great" },
];

const CreateListing = () => {
	const { currentUser } = useAuth();
	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [categories, setCategories] = useState([]);
	const [quantity, setQuantity] = useState(1);
	const [condition, setCondition] = useState(0);
	const [image, setImage] = useState("")
	const [location, setLocation] = useState({});
	const [canSubmit, setCanSubmit] = useState(false);

	useEffect(() => {
		// check for valid form input
		if (
			!title ||
			!description ||
			!categories ||
			!condition ||
			!image ||
			Object.keys(location).length === 0
		) {
			setCanSubmit(false);
		} else {
			setCanSubmit(true);
		}
	}, [title, description, categories, quantity, condition, image, location]);

	const submitListing = async () => {
		setCanSubmit(false);

		/* get imageId after posting to database */
		const imageRes = await postImage({
			base64: image
		})

		const details = {
			quantity: quantity,
			condition: condition,
			posted_date: new Date(),
			categories: categories,
		};
		const listing = {
			title: title,
			location: location,
			description: description,
			user_id: currentUser.uid,
			claimed: false,
			details: details,
			image: imageRes.data._id,
		};
		await postListing(listing);

		navigate("/")
	};

	const handlePlaceSelected = (place) => {
		const latitude = place.geometry.location.lat();
		const longitude = place.geometry.location.lng();
		const address = place.formatted_address;
		const loc = {
			address,
			latitude,
			longitude,
		};
		setLocation(loc);
	};

	const handleQuantityChange = (e) => {
		const value = e.target.value;
		if (isNaN(value)) {
			return;
		}
		setQuantity(value);
	};

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		const base64 = await Image.convertBase64(file);
		setImage(base64)
	}

	return (
		<div className="create-listing-div">
			<h1>Item Information</h1>
			<TextField id="filled-basic" label="Title" variant="filled" onChange={(e) => setTitle(e.target.value)} />
			<TextField
				id="filled-textarea"
				label="Description"
				placeholder="Description"
				multiline
				variant="filled"
				onChange={(e) => setDescription(e.target.value)}
				rows={4}
			/>

			<div className="flocation">
				<Autocomplete
					apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
					onPlaceSelected={handlePlaceSelected}
					options={{
						types: ["address"]
					}}
					onChange={() => setLocation({})}
				/>
			</div>

			<div className="details">
				<div className="category">
					<p>Category:</p>
					<Selector
						options={categoryOptions}
						setValue={setCategories}
						isMulti={true}
					/>
				</div>
				<div className="condition">
					<p>Condition:</p>
					<Selector
						options={conditionOptions}
						setValue={setCondition}
						isMulti={false}
					/>
				</div>
				<div className="quantity">
					<TextField id="filled-basic" label="Quantity" type="number" variant="filled" onChange={handleQuantityChange} />
				</div>
			</div>
			
			<InputFileUpload handleImageUpload={handleImageUpload}></InputFileUpload>

			<button onClick={submitListing} disabled={!canSubmit}>
				Submit
			</button>
		</div>
	);
};

async function postListing(listing) {
	try {
		await axios.post("http://localhost:8000/listing", listing);
	} catch (error) {
		console.log(error);
	}
}

async function postImage(image) {
	try {
		return await axios.post("http://localhost:8000/listing/image", image);
	} catch (error) {
		console.log(error);
	}
}

export default CreateListing;
