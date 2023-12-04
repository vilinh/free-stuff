import "./HomePage.css";
import Spinner from "@cloudscape-design/components/spinner";
import { ListingThumbnail } from "../ListingThumbnail/ListingThumbnail";
import { useLocationContext } from "../../context/Location/LocationContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	getListingsByCoordinates,
	getListingsSorted,
	loadListings,
} from "../../utils/listingService";

export const HomePage = () => {
	const { address, location } = useLocationContext();
	const [locationListings, setLocationListings] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const getListings = async () => {
			setIsLoading(true);
			let lat = location.latitude;
			let lng = location.longitude;
			try {
				let res = null;
				if (lat && lng) {
					res = await getListingsByCoordinates(lat, lng);
				} else {
					res = await getListingsSorted();
				}
				loadListings(res, (data) => {
					setLocationListings(data);
					setIsLoading(false);
				});
			} catch (error) {
				console.log(error);
				setIsLoading(false);
			}
		};
		getListings();
	}, [address]);

	return (
		<div className="container">
			<div className="hero">
				<h3>One man's trash is another man's treasure!</h3>
			</div>
			<div className="featured-listings-div">
				{address ? (
					<h4>
						Showing listings in {address ? address?.split(",")[0] : <Spinner />}{" "}
					</h4>
				) : (
					<h4>Select a location to show listings near that location</h4>
				)}
				<span className="near-you">Near you</span>
				<span className="sub-link" onClick={() => navigate("/search")}>
					{" "}
					See all
				</span>

				<div className="home-listings">
					{locationListings ? (
						locationListings.map((listing, key) => (
							<ListingThumbnail
								listing={listing}
								key={key}
								editListing={false}
							/>
						))
					) : (
						<Spinner />
					)}
				</div>
			</div>
		</div>
	);
};
