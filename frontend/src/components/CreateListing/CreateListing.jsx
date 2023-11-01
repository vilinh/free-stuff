import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/Auth/AuthContext";
import Selector from "../Selector/Selector";
import { useNavigate } from "react-router-dom";
import Image from "../../imageService";

const GOOGLE_MAPS_API_KEY = "AIzaSyDInPcTQd-bJf5uy8R8oGe9ASIk0GmTmH4";

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

	const [loading, setLoading] = useState(true);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [categories, setCategories] = useState([]);
	const [quantity, setQuantity] = useState(1);
	const [condition, setCondition] = useState("");
	const [image, setImage] = useState("")
	const [location, setLocation] = useState({});
	const [canSubmit, setCanSubmit] = useState(false);

	useEffect(() => {
		// check for valid form input
		if (!title || !description || !categories || !condition || !image || !location) {
			setCanSubmit(false);
		} else {
			setCanSubmit(true);
		}
	}, [title, description, categories, quantity, condition, image, location]);

	useEffect(() => {
		async function getAddress(coords) {
			const lat = coords.lat;
			const lng = coords.lng;
			const request = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
			try {
			  const res = await axios.get(request);	
			  console.log("worked!");
			  console.log(res.data.results);
			  return res.data.results[0].formatted_address;
			} catch(error) {
			  console.log("could not fetch address");
			}
		}

		navigator.geolocation.getCurrentPosition(async (position) => {
    	    const latitude = position.coords.latitude;
    	    const longitude = position.coords.longitude;
			const address = await getAddress({ lat: latitude, lng:longitude });
			console.log("Address" + address);
			const loc = {
				address: address,
				latitude: latitude,
				longitude: longitude
			};
			console.log(loc)
			setLocation(loc)
			setLoading(false);
		})

	}, [])

	const submitListing = async () => {
		setCanSubmit(false);

		console.log("LOCATION");
		console.log(location);

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
			image: image,
		};
		console.log("LISTING");
		console.log(listing);
		await makePostCall(listing);
		
		//navigate("/")
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

	if(loading) {
		return <div>Loading...</div>;
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


			<div className="flocation">
				<h4>Address: {location.address}</h4>
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
