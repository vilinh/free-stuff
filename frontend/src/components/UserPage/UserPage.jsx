import { ListingThumbnail } from "../ListingThumbnail/ListingThumbnail";
import { UserPanel } from "../UserPanel/UserPanel";
import "./UserPage.css";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loadListings } from "../../utils/listingService";

export const UserPage = (uid) => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileUid, setProfileUid] = useState("");

  useEffect(() => {
    const getListings = async () => {
      setIsLoading(true);
      let requestUid = auth.currentUser.uid;
      if (Object.keys(uid).length !== 0) {
        requestUid = uid["uid"];
      }
      setProfileUid(requestUid);
      console.log("userpage: " + requestUid);
      try {
        let res = await axios.get(
          `http://localhost:8000/listing/user/${requestUid}`,
        );
        loadListings(res, setListings);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    getListings();
  }, []);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div className="user-page">
      <div className="user-details">
        <UserPanel uid={profileUid} listings={listings.length} />
      </div>
      <div className="user-listings">
        {listings.map((listing, key) => (
          <ListingThumbnail listing={listing} editListing={true} />
        ))}
      </div>
    </div>
  );
};
