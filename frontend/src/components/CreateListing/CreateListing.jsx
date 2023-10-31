import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/Auth/AuthContext";
import Selector from "../Selector/Selector";
import { useNavigate } from "react-router-dom";
import Image from "../../imageService";

const categoryOptions = [
	{ value: "Clothes", label: "Clothes" },
	{ value: "Books", label: "Books" },
	{ value: "Furniture", label: "Furniture" },
];

const conditionOptions = [
	{ value: "Poor", label: "Poor" },
	{ value: "Okay", label: "Okay" },
	{ value: "Good", label: "Good" },
	{ value: "Great", label: "Great" },
];

const CreateListing = () => {
	const { currentUser } = useAuth();
	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [categories, setCategories] = useState([]);
	const [quantity, setQuantity] = useState(1);
	const [condition, setCondition] = useState("");
	const [image, setImage] = useState("")
	const [canSubmit, setCanSubmit] = useState(false);

	useEffect(() => {
		// check for valid form input
		if (!title || !description || !categories || !condition || !image) {
			setCanSubmit(false);
		} else {
			setCanSubmit(true);
		}
	}, [title, description, categories, quantity, condition, image]);

	const submitListing = () => {
		setCanSubmit(false);

		const details = {
			quantity: quantity,
			condition: condition,
			posted_date: new Date(),
			categories: categories,
			address: "test address",
		};
		const listing = {
			title: title,
			description: description,
			user_id: currentUser.uid,
			claimed: false,
			details: details,
			image: image,
		};
		makePostCall(listing);
		navigate("/user");
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
		<div>
			<h1>Item Information</h1>

			<label for="ftitle">Title</label>
			<br></br>
			<input
				type="text"
				id="ftitle"
				onChange={(e) => setTitle(e.target.value)}
			/>
			<br></br>

			<label for="fdesc">Description</label>
			<br></br>
			<textarea
				id="fdesc"
				cols="30"
				rows="10"
				onChange={(e) => setDescription(e.target.value)}
			></textarea>

			<div className="details">
				<div className="category">
					<p>Category:</p>
					<Selector
						options={categoryOptions}
						setValue={setCategories}
						isMulti={true}
					/>
				</div>

				<div className="quantity">
					<p>Quantity:</p>
					<input
						type="number"
						min={1}
						value={quantity}
						onChange={handleQuantityChange}
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
			</div>

			<input
				id="image"
				type="file"
				accept="image/*"
				// onChange={(e) => Image.uploadBackgroundImage(e, refresh, setRefresh)}
				onChange={handleImageUpload}
			/>

			<button onClick={submitListing} disabled={!canSubmit}>
				Submit
			</button>
		</div>
	);
};

async function makePostCall(listing) {
	try {
		await axios.post("http://localhost:8000/listing", listing);
	} catch (error) {
		console.log(error);
	}
}

export default CreateListing;
