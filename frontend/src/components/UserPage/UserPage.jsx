import { ListingThumbnail } from "../ListingThumbnail/ListingThumbnail";
import { UserPanel } from "../UserPanel/UserPanel";
import Grid from "@mui/material/Grid";
import "./UserPage.css";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export const UserPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const getListings = async () => {
      try {
        let res = await axios.get(
          `http://localhost:8000/listing/user/${auth.currentUser.uid}`
        );
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
        <UserPanel/>
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
