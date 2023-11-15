import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/Auth/AuthContext";
import { getUserById } from "../../utils/userService";
import { getListingById } from "../../utils/listingService";
import { ListingPanel } from "../ListingPanel/ListingPanel";
import { CircularProgress } from "@mui/material";

export default function ClaimedListing() {
	const [listings, setListings] = useState();
	const { currentUser } = useAuth();

	useEffect(() => {
		const getListings = async () => {
			let promises = [];
			const { data } = await getUserById(currentUser.uid);
			data.claimed_listings.forEach(async (id) => {
				promises.push(getListingById(id));
			});

			Promise.all(promises).then((values) => setListings(values));
		};

		getListings();
	}, []);

	return (
		<div>
			{listings ? (
				listings.map((listing, key) => (
					<ListingPanel listing={listing.data} key={key} />
				))
			) : (
				<CircularProgress />
			)}
		</div>
	);
}