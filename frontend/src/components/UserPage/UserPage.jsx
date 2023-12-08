import { ListingThumbnail } from "../ListingThumbnail/ListingThumbnail";
import { UserPanel } from "../UserPanel/UserPanel";
import "./UserPage.css";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loadListings } from "../../utils/listingService";
import { useAuth } from "../../context/Auth/AuthContext";

export const UserPage = (uid) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

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
          <ListingThumbnail listing={listing} editListing={profileUid === currentUser.uid} />
        ))}
      </div>
    </div>
  );
};
