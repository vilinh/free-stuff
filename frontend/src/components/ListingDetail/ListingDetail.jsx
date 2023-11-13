import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { ListingPanel } from "../ListingPanel/ListingPanel";

export default function ListingDetail() {
	const { id } = useParams();
	const [listing, setListing] = useState();

	useEffect(() => {
		const getListings = async () => {
			try {
				let res = await axios.get(`http://localhost:8000/listing/${id}`);
				setListing(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		getListings();
	}, []);

	return (
		<div>
			{listing ? <ListingPanel listing={listing} /> : <CircularProgress />}
		</div>
	);
}
