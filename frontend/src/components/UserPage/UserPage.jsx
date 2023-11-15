import { ListingThumbnail } from "../ListingThumbnail/ListingThumbnail";
import { UserPanel } from "../UserPanel/UserPanel";
import Grid from "@mui/material/Grid";
import "./UserPage.css";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Button } from "@mui/material";
import { useNotif } from "../../context/Notifications/NotificationContext";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const UserPage = () => {
	const auth = getAuth();
	const navigate = useNavigate();
	const { notif, notifObj, closeNotif } = useNotif();

	const [listings, setListings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getListings = async () => {
			setIsLoading(true);
			try {
				let res = await axios.get(
					`http://localhost:8000/listing/user/${auth.currentUser.uid}`
				);
				setListings(res.data);
				setIsLoading(false);
			} catch (error) {
				console.log(error);
			}
		};
		getListings();
	}, []);

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div className="user-page">
			{notif && (
				<Alert
					className="create-listing-notif"
					onClose={() => {
						closeNotif();
					}}
					severity={notifObj.type}
				>
					{notifObj.message}
				</Alert>
			)}
			<div className="user-details">
				<UserPanel
					username={auth.currentUser.email}
					listings={listings.length}
				/>
			</div>
			<div className="claimed-listings">
				<Button onClick={() => navigate("/claimedListing")}>
					Claimed Listings
				</Button>
			</div>
			<div className="user-listings">
				{listings.map((listing, key) => (
					<ListingThumbnail listing={listing} editListing={true} />
				))}
			</div>
		</div>
	);
};
