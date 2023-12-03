import { ListingPanel } from "../ListingPanel/ListingPanel";
import { UserPanel } from "../UserPanel/UserPanel";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./ListingPage.css";
import { useLocationContext } from "../../context/Location/LocationContext";
import { CircularProgress } from "@mui/material";
import {
  getListingsByCoordinates,
  getListingsSorted,
  loadListings,
} from "../../utils/listingService";

export const ListingPage = () => {
  const [listings, setListings] = useState([]);
  const { address, location } = useLocationContext();

  useEffect(() => {
    const getListings = async () => {
      try {
        let res = null;
        let lat = location?.latitude;
        let lng = location?.longitude;
        if (lat && lng) {
          res = await getListingsByCoordinates(lat, lng);
        } else {
          res = await getListingsSorted();
        }
        setListings(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getListings();
  }, [address]);

  return (
    <div className="listing-page">
      {address ? (
        <h4>Viewing listings around {address?.split(",")[0]}</h4>
      ) : (
        <span>Set a location to find listings near the area</span>
      )}
      <div className="listings">
        {listings.length ? (
          listings.map((listing, key) => (
            <div className="listing">
              <ListingPanel listing={listing} key={key} />
            </div>
          ))
        ) : (
          <CircularProgress />
        )}
      </div>
    </div>
  );
};
