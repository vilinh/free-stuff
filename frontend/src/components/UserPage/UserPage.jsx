import { ListingThumbnail } from "../ListingThumbnail/ListingThumbnail";
import { UserPanel } from "../UserPanel/UserPanel";
import Grid from "@mui/material/Grid";
import "./UserPage.css";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = "AIzaSyDInPcTQd-bJf5uy8R8oGe9ASIk0GmTmH4";

export const UserPage = () => {
	const auth = getAuth();
	const navigate = useNavigate();

  const [listings, setListings] = useState([])
  const [address, setAddress] = useState("");

  useEffect(() => {
		async function getAddress(coords) {
			const lat = coords.lat;
			const lng = coords.lng;
			const request = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
			try {
			  const res = await axios.get(request);	
			  setAddress(res.data.results[0].formatted_address);
			} catch(error) {
			  console.log("could not fetch address");
			}
		}

    	if (navigator.geolocation) {
    	  navigator.geolocation.getCurrentPosition((position) => {
    	    const latitude = position.coords.latitude;
    	    const longitude = position.coords.longitude;
			getAddress({ lat: latitude, lng:longitude });
    	  });
    	}

		const getListings = async () => {
			try {
				let res = await axios.get(`http://localhost:8000/listing/user/${auth.currentUser.uid}`);
				setListings(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		getListings();
	}, []);	
	
	return (
		<div className="user-page">
			<div className="user-details">
				<UserPanel address={address.split(',')[0]}/>
			</div>
			<div className="user-listings">
				<Grid container spacing={2} columns={16}>
					{listings.map((listing, key) => (
						<Grid item xs={4}>
							<ListingThumbnail listing={listing} />
						</Grid>
					))}
				</Grid>
			</div>
		</div>
	);
};
