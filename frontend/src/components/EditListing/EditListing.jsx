import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import {
	convertBase64,
	postImage,
	getImageFromId,
	updateImageById,
} from "../../utils/imageService";
import {
	categoryOptions,
	conditionOptions,
	getListingById,
	updateListingById,
} from "../../utils/listingService";
import Autocomplete from "react-google-autocomplete";
import CustomAutocomplete from "@mui/material/Autocomplete";
import "../CreateListing/CreateListing.css";
import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	styled,
} from "@mui/material";
import InputFileUpload from "../InputFileUpload/InputFileUpload";
import { useParams } from "react-router-dom";

export const EditListing = ({ listing }) => {
	const { currentUser } = useAuth();
	const { id } = useParams();
	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [categories, setCategories] = useState([]);
	const [quantity, setQuantity] = useState(1);
	const [condition, setCondition] = useState("");
	const [imageId, setImageId] = useState("");
	const [base64, setBase64] = useState("");
	const [imageName, setImageName] = useState("");
	const [location, setLocation] = useState({});
	const [postedDate, setPostedDate] = useState("");
	const [canSubmit, setCanSubmit] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// load initial data
	useEffect(() => {
		const getListingData = async () => {
			try {
				const data = await getListingById(id);
				const { title, description, details, image, location } = data.data;
				const { categories, condition, quantity, posted_date } = details;

				const imageRes = await getImageFromId(image);
				const { base64, name } = imageRes.data;

				// set initial states
				setTitle(title);
				setDescription(description);
				setCondition(condition);
				setQuantity(quantity);
				setCategories(categories);
				setLocation(location);
				setPostedDate(posted_date);
				setImageId(image);
				setBase64(base64);
				setImageName(name);

				setIsLoading(false)
			} catch (error) {
				// TODO: Error Page
				navigate('/')
			}
		};

		getListingData();
	}, []);

	useEffect(() => {
		// check for valid form input
		if (
			!title ||
			!description ||
			!categories ||
			!condition ||
			!base64 ||
			Object.keys(location).length === 0
		) {
			setCanSubmit(false);
		} else {
			setCanSubmit(true);
		}
	}, [title, description, categories, quantity, condition, base64, location]);

	const submitListing = async () => {
		setCanSubmit(false);

		await updateImageById(imageId, {
			base64: base64,
			name: imageName
		})

		const details = {
			quantity: quantity,
			condition: condition,
			posted_date: postedDate,
			categories: categories,
		};
		const listing = {
			title: title,
			location: location,
			description: description,
			user_id: currentUser.uid,
			claimed: false,
			details: details,
			image: imageId,
		};
		await updateListingById(id, listing);

		navigate("/");
	};

	const handleConditionSelected = (event) => {
		setCondition(event.target.value);
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
		if (file) {
			const base64 = await convertBase64(file);
			setBase64(base64);
			setImageName(file.name);
		}
	};

	if (isLoading) {
		return (
			<p>Loading ...</p>
		)
	}

	return (
		<div className="create-listing-div">
			<h1>Edit Listing</h1>
			<InputFileUpload handleImageUpload={handleImageUpload}></InputFileUpload>
			{ base64 && <img src={base64} width={200} height={200}/>}
      { imageName && <p>{imageName}</p>}

			<TextField
				id="filled-basic"
				variant="filled"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<TextField
				id="filled-textarea"
				value={description}
				placeholder="Description"
				multiline
				variant="filled"
				onChange={(e) => setDescription(e.target.value)}
				rows={4}
			/>

			<div className="location">
				<Autocomplete
					style={{
						border: ".05rem solid",
						borderRadius: ".25rem",
						width: "90%",
						fontSize: "1rem",
					}}
					value={location ? location.address : ""}
					apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
					onPlaceSelected={handlePlaceSelected}
					options={{
						types: ["address"],
					}}
					onChange={() => setLocation({})}
				/>
				<TextField
					size="small"
					id="filled-basic"
					value={quantity}
					type="number"
					variant="filled"
					onChange={handleQuantityChange}
				/>
			</div>

			<div className="details">
				<FormControl>
					<InputLabel id="conditionSelectLabel">Condition</InputLabel>
					<Select
						labelId="conditionSelectLabel"
						id="conditionSelect"
						value={condition}
						onChange={handleConditionSelected}
					>
						{conditionOptions.map(({ value, label }, index) => (
							<MenuItem key={index} value={value}>
								{label}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<CustomAutocomplete
					multiple
					id="tags-categories"
					options={categoryOptions}
					value={categories}
					onChange={(event, value) => {
						setCategories(value);
					}}
					renderInput={(params) => (
						<TextField {...params} label="Categories" placeholder="" />
					)}
				/>
			</div>

			<Button variant="contained" onClick={submitListing} disabled={!canSubmit}>
				Submit
			</Button>
		</div>
	);
};
